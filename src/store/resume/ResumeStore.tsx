import { autorun, makeAutoObservable, reaction, runInAction, toJS } from "mobx";
import {
  Button,
  Collapse,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Select,
  message,
} from "antd";
import React, { ReactNode } from "react";
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import * as _ from "lodash";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import JsPDF from "jspdf";
import {
  GroupConfig,
  Resume,
  WithIcon,
  createResume,
  deleteResume,
  findAllResume,
  findOneResume,
  updateResume,
} from "@/apis/resume";
import {
  ICON_CLASSNAMES_MAP,
  ensureArray,
  handleResponse,
  iconfontCx,
} from "@/utils";
import { FormModalHandler, useFormModal } from "@/components/Modal";
import DynamicTagSelector from "@/pages/Resume/DynamicTagSelector";
import { ArrayType } from "@/types";

type PersonalInfoFieldType = WithIcon<string>[];
type GroupFieldType = GroupConfig;

const defaultResumeData = {
  resumeName: "新的简历",
  resumeConfig: {
    title: "XX工程师",
    groupConfig: [
      {
        subtitle: "教育背景",
        contents: [
          {
            contentTitle: "XXXX信息工程大学",
            timeRange: ["2020.09.10", "2024.06.10"],
            detail: "我在XXXX读书",
          },
        ],
      },
      {
        subtitle: "实习经验",
        contents: [
          {
            contentTitle: "XXXX软件技术有限公司",
            timeRange: ["2020.09.10", "2024.06.10"],
            description: "前端开发实习生",
            detail: [
              "参与项目部分模块数据管理方案重构，使用开源库 mobx-state-tree 替代 mobx 规范开发流程，独立设计并实现 fetchModel 请求通用模型，为请求常见的 防抖、轮询、异步竞态、数据缓存、错误校验 等问题提供了标准解决方案。",
              "参与日常需求开发，有 Web、App、小程序 三端需求开发经验，独立设计并完成多个中型需求，封装、改良数个全域公用组件，开发 日均 bug 率 0.2。",
              "主R某业务域的日常维护，处理线上工单，为用户提供线上排错并负责 bug 修复，对工作中业务侧场景有一定处理经验。",
            ],
          },
        ],
      },
      {
        subtitle: "项目经历",
        contents: [
          {
            contentTitle: "test-ui",
            tags: ["Vue3", "Ts", "pnpm", "Monorepo", "SCSS"],
            detail: [
              "负责项目基础结构搭建 , 使用 pnpm + Monorepo 项目依赖管理方式降低项目依赖管理成本。样式预处理选择 SCSS 结合 Bem 规范 , 提升项目样式规范性和开发效率。",
              "组件内部实现通用逻辑，预留 插槽、实例方法 提升组件可拓展、可自定义性。",
              "针对开发需求，封装了如 DOM操作、CSS预处理、类型断言 等一系列工具。",
              "各组件均有基于 Vitest 编写的单元测试，确保打包后的项目能够正常运行。",
            ],
            description: [
              "该项目是一个基于 Vue3 的业务组件库，旨在提高项目代码复用率及 UI 样式规范性。",
              "GitHub项目地址：https://github.com/molix-ui/Molix",
            ],
          },
        ],
      },
    ],
    personalInfo: {
      leftPart: [
        {
          icon: "mian-renwu",
          content: "XX/男/2000.10",
        },
        {
          icon: "weixin",
          content: "resumu66666",
        },
      ],

      rightPart: [
        {
          icon: "fangzi",
          content: "www.resume.com",
        },
        {
          icon: "github",
          content: "https://github.com/resume666",
        },
      ],
    },
  },
};

export default class ResumeStore {
  currentId: string = "";

  resumeList: Resume[] = [];

  currentResumeData!: Resume;

  constructor() {
    makeAutoObservable(this);
    // currentId 改变重新渲染
    autorun(() => {
      const findResume = this.resumeList.find(
        (resume) => resume._id === this.currentId,
      );
      if (findResume) this.setCurrentResumeData(findResume);
      else this.setCurrentResumeData(defaultResumeData as Resume);
    });
  }

  getTreeData = (formModalHandler: FormModalHandler) => {
    return this?.formatTreeDataFromResume?.(
      toJS(this.currentResumeData),
      formModalHandler,
    );
  };

  /** 设置当前简历数据 */
  private setCurrentResumeData = (resumeData: Resume) => {
    this.currentResumeData = resumeData;
  };

  /** 根据path获取当前简历数据 */
  private getResumeData = (path: string) => {
    return toJS(_.get(this.currentResumeData, path));
  };

  /** 修改当前简历数据 */
  modifyResumeData = (path: string, newValue: any) => {
    const newResumeData = _.cloneDeep(this.currentResumeData);
    _.set(newResumeData, path, newValue);
    this.setCurrentResumeData(newResumeData);
  };

  pushPersonalInfo = (value: any, side: "left" | "right") => {
    const path = `resumeConfig.personalInfo.${side}Part`;
    const oldInfo = ensureArray(this.getResumeData(path));
    this.modifyResumeData(path, [...oldInfo, value]);
  };

  deletePersonalInfo = (index: number, side: "left" | "right") => {
    const path = `resumeConfig.personalInfo.${side}Part`;
    const oldInfo = ensureArray(this.getResumeData(path));
    oldInfo.splice(index, 1);
    this.modifyResumeData(path, [...oldInfo]);
  };

  pushGroupConfig = (value: GroupConfig) => {
    const path = `resumeConfig.groupConfig`;
    const oldInfo = ensureArray(this.getResumeData(path));
    this.modifyResumeData(path, [...oldInfo, value]);
  };

  deleteGroupConfig = (index: number) => {
    const path = "resumeConfig.groupConfig";
    const oldGroup = ensureArray(this.getResumeData(path));
    oldGroup.splice(index, 1);
    this.modifyResumeData(path, [...oldGroup]);
  };

  setCurrentId = (_id: string) => {
    this.currentId = _id;
  };

  resetResumeData = () => {
    this.currentId = "";
  };

  /** 编辑标题 */
  private handleEditTitle = (
    formModalHandler: FormModalHandler,
    title: string,
  ) => {
    formModalHandler.open<{ title: string }>({
      modalProps: {
        title: "修改标题",
        onOk: ({ title }) => {
          this.modifyResumeData("resumeConfig.title", title);
        },
      },
      formChildren: this.renderTitleForm(),
      initialValue: {
        title,
      },
    });
  };

  /** 编辑个人信息 */
  private handleEditPersonalInfo = (
    formModalHandler: FormModalHandler,
    defaultValue: any,
    side: "left" | "right",
    index: number,
  ) => {
    formModalHandler.open<PersonalInfoFieldType>({
      modalProps: {
        title: "修改项目",
        onOk: (values) => {
          this.modifyResumeData(
            `resumeConfig.personalInfo.${side}Part[${index}]`,
            values,
          );
        },
      },
      formChildren: this.renderPersonalInfoForm(),
      initialValue: {
        ...defaultValue,
      },
    });
  };

  /** 编辑个人信息 */
  private handleEditGroupConfig = (
    formModalHandler: FormModalHandler,
    defaultValue: any,
    index: number,
  ) => {
    formModalHandler.open<PersonalInfoFieldType>({
      modalProps: {
        title: "修改信息",
        onOk: (values) => {
          this.modifyResumeData(`resumeConfig.groupConfig[${index}]`, values);
        },
        width: 800,
      },
      formChildren: this.renderGroupForm(),
      initialValue: {
        ...defaultValue,
      },
    });
  };

  /** 导出PNG */
  handleExportPNG = (id: string) => {
    html2canvas(document.getElementById(id)!, {
      allowTaint: false,
      useCORS: true, // 支持跨域图片的截取，不然图片截取不出来
    }).then((canvas) => {
      const link = document.createElement("a"); // 建立一个超连接对象实例
      const event = new MouseEvent("click"); // 建立一个鼠标事件的实例
      link.download = `${this.currentResumeData.resumeName}.png`; // 设置要下载的图片的名称
      link.href = canvas.toDataURL(); // 将图片的URL设置到超连接的href中
      link.dispatchEvent(event); // 触发超连接的点击事件
    });
  };

  /** 导出PDF */
  handleExportPDF = async (id: string) => {
    const title = this.currentResumeData.resumeName;
    const ele = document.getElementById(id);
    // 根据dpi放大，防止图片模糊
    const scale = window.devicePixelRatio > 1 ? window.devicePixelRatio : 2;
    // 下载尺寸 a4 纸 比例
    const pdf = new JsPDF("p", "pt", "a4");
    let width = ele?.clientWidth ?? 0;
    let height = ele?.clientHeight ?? 0;

    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const contentWidth = width;
    const contentHeight = height;

    // 一页pdf显示html页面生成的canvas高度;
    const pageHeight = (contentWidth / 592.28) * 841.89;
    // 未生成pdf的html页面高度
    let leftHeight = contentHeight;
    // 页面偏移
    let position = 0;
    // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
    const imgWidth = 595.28;
    const imgHeight = (592.28 / contentWidth) * contentHeight;
    const pdfCanvas = await html2canvas(ele!, {
      useCORS: true,
      canvas,
      scale,
      width,
      height,
      x: 0,
      y: 0,
    });
    const imgDataUrl = pdfCanvas.toDataURL();

    if (height > 14400) {
      // 超出jspdf高度限制时
      const ratio = 14400 / height;
      // height = 14400;
      width *= ratio;
    }
    console.log("contentWidth", contentWidth);
    console.log("leftHeight", leftHeight, pageHeight);
    console.log("ele", ele?.clientWidth);

    // 缩放为 a4 大小 pdf.internal.pageSize 获取当前pdf设定的宽高
    height = (height * pdf.internal.pageSize.getWidth()) / width;
    width = pdf.internal.pageSize.getWidth();
    if (leftHeight < pageHeight) {
      pdf.addImage(imgDataUrl, "png", 0, 0, imgWidth, imgHeight);
    } else {
      // 分页
      while (leftHeight > 0) {
        pdf.addImage(imgDataUrl, "png", 0, position, imgWidth, imgHeight);
        leftHeight -= pageHeight;
        position -= 841.89;
        // 避免添加空白页

        if (leftHeight > 0) {
          pdf.addPage();
        }
      }
    }
    // 导出下载
    pdf.save(`${title}.pdf`);
  };

  /** 将简历配置格式化成树形 */
  private formatTreeDataFromResume = (
    resumeData: Resume,
    formModalHandler: FormModalHandler,
  ) => {
    const { resumeConfig } = resumeData;
    const { title, groupConfig, personalInfo } = resumeConfig;
    const { leftPart, rightPart } = personalInfo;

    const generateTreeNode = (
      title?: ReactNode,
      key?: React.Key,
      icon?: ReactNode,
      children?: any,
      callBack?: () => any,
    ) => ({
      title,
      key,
      icon,
      children,
      callBack,
    });

    const convertPersonalInfo = () => {
      const baseConfig = [
        {
          side: "left" as const,
          title: "左侧列表",
          key: "2-1",
          icon: <span className={iconfontCx("zuo")}></span>,
        },
        {
          side: "right" as const,
          title: "右侧列表",
          key: "2-2",
          icon: <span className={iconfontCx("you")}></span>,
        },
      ];

      const genChildren = (config: ArrayType<typeof baseConfig>) => {
        const { side, title, key, icon } = config;
        const part = side === "left" ? leftPart : rightPart;
        return generateTreeNode(title, key, icon, [
          ...part.map((item, index) =>
            generateTreeNode(
              this.renderTitleWithOpr(
                item.content,
                () => this.deletePersonalInfo(index, side),
                () =>
                  this.handleEditPersonalInfo(
                    formModalHandler,
                    item,
                    side,
                    index,
                  ),
              ),
              `${key}-${index + 1}`,
              <span className={iconfontCx(item.icon)}></span>,
              [],
            ),
          ),
          {
            title: "新增一项",
            key: `114-51${key}`,
            icon: <span className={iconfontCx("tianjia")}></span>,
            callBack: () =>
              formModalHandler.open({
                modalProps: {
                  title: `添加至${title}`,
                  onOk: (values) => this.pushPersonalInfo(values, side),
                },
                formChildren: this.renderPersonalInfoForm(),
              }),
          },
        ]);
      };

      const personalInfoTreeChildren = baseConfig.map((config) =>
        genChildren(config),
      );

      return generateTreeNode(
        "个人信息",
        "2",
        <span className={iconfontCx("mian-renwu")}></span>,
        personalInfoTreeChildren,
      );
    };

    const convertGroupConfig = () => {
      return generateTreeNode(
        "详细信息",
        "3",
        <span className={iconfontCx("xiangxi1")}></span>,
        [
          ...groupConfig.map((item, index1) => {
            const contentTreeData = ensureArray(item.contents).map(
              (content, index2) =>
                generateTreeNode(
                  content.contentTitle,
                  `3-${index1}-${index2}`,
                  <span className={iconfontCx("biaoti")}></span>,
                ),
            );

            return generateTreeNode(
              this.renderTitleWithOpr(
                item.subtitle,
                () => this.deleteGroupConfig(index1),
                () =>
                  this.handleEditGroupConfig(formModalHandler, item, index1),
              ),
              `3-${index1}`,
              <span className={iconfontCx("xiangxi")}></span>,
              contentTreeData,
            );
          }),
          {
            title: "新增一项",
            key: "114-516",
            icon: <span className={iconfontCx("tianjia")}></span>,
            callBack: () =>
              formModalHandler.open<GroupFieldType>({
                modalProps: {
                  title: "添加新项目",
                  onOk: (values) => this.pushGroupConfig(values),
                  width: 800,
                },
                formChildren: this.renderGroupForm(),
                initialValue: {
                  contents: [{}],
                },
              }),
          },
        ],
        () => {},
      );
    };

    const treeData = [
      generateTreeNode(
        "标题",
        "1",
        <span className={iconfontCx("biaoti")}></span>,
        [
          generateTreeNode(
            this.renderTitleWithOpr(title, undefined, () =>
              this.handleEditTitle(formModalHandler, title),
            ),
            "1-1",
          ),
        ],
      ),
      convertPersonalInfo(),
      convertGroupConfig(),
    ];

    return treeData;
  };

  /** 个人信息 modal form */
  private renderPersonalInfoForm = () => {
    // 遍历图标
    const options = Object.values(ICON_CLASSNAMES_MAP).map((name) => ({
      value: name,
      label: <span className={iconfontCx(name)}></span>,
    }));

    return (
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="内容"
          name="content"
          rules={[{ required: true, message: "请输入内容" }]}
        >
          <Input placeholder="请输入内容" />
        </Form.Item>
        <Form.Item label="图标" name="icon">
          <Select style={{ width: 80 }} options={options} />
        </Form.Item>
      </Form>
    );
  };

  /** 标题 modal form */
  private renderTitleForm = () => {
    return (
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="简历标题"
          name="title"
          rules={[{ required: true, message: "请输入内容" }]}
        >
          <Input placeholder="请输入简历标题" />
        </Form.Item>
      </Form>
    );
  };

  /** 分组 modal form */
  private renderGroupForm = () => {
    return (
      <Form
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 24 }}
        name="dynamic_form_complex"
        style={{ maxWidth: 800 }}
        autoComplete="off"
      >
        <Form.Item
          label="总体标题"
          name="subtitle"
          rules={[{ required: true, message: "请输入总体标题" }]}
        >
          <Input placeholder="请输入总体标题" />
        </Form.Item>
        <Form.List name="contents">
          {(fields, { add, remove }) => (
            <div
              style={{ display: "flex", rowGap: 16, flexDirection: "column" }}
            >
              {fields.map((field) => (
                <Collapse
                  size="small"
                  items={[
                    {
                      key: field.key,
                      label: `项目 ${field.name + 1}`,
                      extra: (
                        <CloseOutlined
                          onClick={() => {
                            remove(field.name);
                          }}
                        />
                      ),
                      children: (
                        <>
                          <Form.Item
                            label="内容标题"
                            name={[field.name, "contentTitle"]}
                            rules={[
                              { required: true, message: "请输入内容标题" },
                            ]}
                          >
                            <Input placeholder="请输入内容标题" />
                          </Form.Item>

                          <Form.Item label="标签" name={[field.name, "tags"]}>
                            <DynamicTagSelector />
                          </Form.Item>

                          <Form.Item
                            label="时间范围"
                            name={[field.name, "timeRange"]}
                            getValueFromEvent={(dates, dateStrings) =>
                              dateStrings
                            }
                            getValueProps={(values: string[]) => ({
                              value: values
                                ? values.map((val) => dayjs(val))
                                : undefined,
                            })}
                          >
                            <DatePicker.RangePicker format="YYYY.MM.DD" />
                          </Form.Item>

                          <Form.Item label="非列表描述">
                            <Form.List name={[field.name, "description"]}>
                              {(descFields, subOpt) => (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    rowGap: 16,
                                  }}
                                >
                                  {descFields.map((descField) => (
                                    <div
                                      key={descField.key}
                                      style={{
                                        width: "98%",
                                        display: "flex",
                                      }}
                                    >
                                      <Form.Item noStyle name={descField.name}>
                                        <TextArea
                                          placeholder="请输入描述"
                                          autoSize={{ minRows: 1, maxRows: 2 }}
                                        />
                                      </Form.Item>
                                      <CloseOutlined
                                        style={{ marginLeft: 5 }}
                                        onClick={() => {
                                          subOpt.remove(descField.name);
                                        }}
                                      />
                                    </div>
                                  ))}
                                  <Button
                                    type="dashed"
                                    onClick={() => subOpt.add()}
                                    block
                                  >
                                    + 添加下一个
                                  </Button>
                                </div>
                              )}
                            </Form.List>
                          </Form.Item>

                          <Form.Item label="列表描述">
                            <Form.List name={[field.name, "detail"]}>
                              {(detailFields, subOpt) => (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    rowGap: 16,
                                  }}
                                >
                                  {detailFields.map((detailField) => (
                                    <div
                                      key={detailField.key}
                                      style={{
                                        width: "98%",
                                        display: "flex",
                                      }}
                                    >
                                      <Form.Item
                                        noStyle
                                        name={detailField.name}
                                      >
                                        <TextArea
                                          placeholder="请输入描述"
                                          autoSize={{ minRows: 1, maxRows: 2 }}
                                        />
                                      </Form.Item>
                                      <CloseOutlined
                                        style={{ marginLeft: 5 }}
                                        onClick={() => {
                                          subOpt.remove(detailField.name);
                                        }}
                                      />
                                    </div>
                                  ))}
                                  <Button
                                    type="dashed"
                                    onClick={() => subOpt.add()}
                                    block
                                  >
                                    + 添加下一个
                                  </Button>
                                </div>
                              )}
                            </Form.List>
                          </Form.Item>
                        </>
                      ),
                    },
                  ]}
                  key={field.key}
                />
              ))}

              <Button type="dashed" onClick={() => add()} block>
                添加子项目
              </Button>
            </div>
          )}
        </Form.List>
      </Form>
    );
  };

  private renderTitleWithOpr = (
    title: string,
    deleteCb?: () => any,
    editCb?: () => any,
  ) => {
    return (
      <span
        style={{
          display: "inline-flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "90%",
        }}
      >
        <span>{title}</span>
        <span>
          <EditOutlined style={{ marginRight: "10px" }} onClick={editCb} />
          {deleteCb && (
            <Popconfirm
              title="删除项目"
              description="确定删除该项目吗?"
              onConfirm={deleteCb}
              okText="确定"
              cancelText="取消"
            >
              <CloseOutlined />
            </Popconfirm>
          )}
        </span>
      </span>
    );
  };

  findAllResumeOpr = async () => {
    const res = await findAllResume();
    handleResponse(
      res,
      (res) => {
        runInAction(() => {
          const { data } = res;
          this.resumeList = data;
        });
      },
      (res) => {
        const { ret } = res;
        message.error(ret);
      },
    );
  };

  findOneResumeOpr = async () => {
    const res = await findOneResume(this.currentId);
    handleResponse(
      res,
      (res) => {
        runInAction(() => {
          const { data } = res;
          this.setCurrentResumeData(data);
        });
      },
      (res) => {
        const { ret } = res;
        message.error(ret);
      },
    );
  };

  createResumeOpr = async () => {
    const res = await createResume(toJS(this.currentResumeData));
    handleResponse(
      res,
      (res) => {
        message.success(res.msg);
      },
      (res) => {
        const { ret } = res;
        message.error(ret);
      },
    );
  };

  updateResumeOpr = async () => {
    const res = await updateResume(toJS(this.currentResumeData));
    handleResponse(
      res,
      (res) => {
        message.success(res.msg);
      },
      (res) => {
        const { ret } = res;
        message.error(ret);
      },
    );
  };

  deleteResumeOpr = async (_id: string) => {
    const res = await deleteResume(_id);
    handleResponse(
      res,
      (res) => {
        message.success(res.msg);
      },
      (res) => {
        const { ret } = res;
        message.error(ret);
      },
    );
  };
}
