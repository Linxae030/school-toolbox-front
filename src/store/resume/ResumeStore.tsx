import { makeAutoObservable, reaction, runInAction } from "mobx";
import { message } from "antd";
import React, { ReactNode } from "react";
import { MehOutlined, SmileOutlined } from "@ant-design/icons";
import { Resume } from "@/apis/resume";
import { ensureArray } from "@/utils";

const defaultResumeData = {
  name: "新的简历",
  version: "1",
  resumeConfig: {
    title: "XX工程师",
    groupConfig: [
      {
        subtitle: "教育背景",
        contents: [
          {
            contentTitle: "XXXX信息工程大学",
            timeRange: {
              start: "20XX.09",
              end: "20XX.6",
            },
            detail: "我在XXXX读书",
          },
        ],
      },
      {
        subtitle: "实习经验",
        contents: [
          {
            contentTitle: "XXXX软件技术有限公司",
            timeRange: {
              start: "20XX.02.10",
              end: "20XX.07.15",
            },
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
          clickAble: true,
        },
        {
          icon: "github",
          content: "https://github.com/resume666",
          clickAble: true,
        },
      ],
    },
  },
};

export default class ResumeStore {
  currentId: string = "123";

  resumeList: Resume[] = [
    {
      _id: "123",
      user: "linxae",
      name: "test1",
      version: "1",
      resumeConfig: {
        title: "前端工程师",
        groupConfig: [
          {
            subtitle: "教育背景",
            contents: [
              {
                contentTitle: "成都信息工程大学",
                timeRange: {
                  start: "2020.09",
                  end: "2024.6",
                },
                detail: "成信大读书",
              },
            ],
          },
          {
            subtitle: "实习经验",
            contents: [
              {
                contentTitle: "成都美团软件技术有限公司 | 餐饮 SaaS",
                timeRange: {
                  start: "2023.04.10",
                  end: "2023.08.25",
                },
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
                contentTitle: "molix-ui",
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
              content: "高歌/男/2001.10",
            },
            {
              icon: "weixin",
              content: "gaoge949699002",
            },
          ],

          rightPart: [
            {
              icon: "fangzi",
              content: "www.linxae.com",
              clickAble: true,
            },
            {
              icon: "github",
              content: "https://github.com/Linxae030",
              clickAble: true,
            },
          ],
        },
      },
    },
  ];

  currentResumeData!: Resume;

  constructor() {
    makeAutoObservable(this);
    // currentId 改变重新渲染
    reaction(
      () => {
        const findResume = this.resumeList.find(
          (resume) => resume._id === this.currentId,
        );
        if (findResume) this.setCurrentResumeData(findResume);
        else this.setCurrentResumeData(defaultResumeData as any);
      },
      () => this.currentId,
    );
  }

  get treeData() {
    return this.formatTreeDataFromResume(this.currentResumeData);
  }

  private setCurrentResumeData = (resumeData: Resume) => {
    this.currentResumeData = resumeData;
  };

  setCurrentId = (_id: string) => {
    this.currentId = _id;
  };

  // 将简历配置格式化成树形
  private formatTreeDataFromResume = (resumeData: Resume) => {
    const { resumeConfig } = resumeData;
    const { title, groupConfig, personalInfo } = resumeConfig;
    const { leftPart, rightPart } = personalInfo;

    const generateTreeNode = (
      title?: string,
      key?: React.Key,
      icon?: ReactNode,
      children?: any,
    ) => ({
      title,
      key,
      icon,
      children,
    });

    const convertPersonalInfo = () => {
      const leftPartTreeData = generateTreeNode(
        "左侧列表",
        "2-1",
        <span className="iconfont icon-zuo"></span>,
        leftPart.map((item, index) =>
          generateTreeNode(
            item.content,
            `2-1-${index + 1}`,
            <span className={`iconfont icon-${item.icon}`}></span>,
          ),
        ),
      );

      const rightPartTreeData = generateTreeNode(
        "右侧列表",
        "2-2",
        <span className="iconfont icon-you"></span>,
        rightPart.map((item, index) =>
          generateTreeNode(
            item.content,
            `2-2-${index + 1}`,
            <span className={`iconfont icon-${item.icon}`}></span>,
          ),
        ),
      );

      return generateTreeNode(
        "个人信息",
        "2",
        <span className="iconfont icon-mian-renwu"></span>,
        [leftPartTreeData, rightPartTreeData],
      );
    };

    const convertGroupConfig = () => {
      return generateTreeNode(
        "详细信息",
        "3",
        <span className="iconfont icon-xiangxi1"></span>,
        groupConfig.map((item, index1) => {
          const contentTreeData = ensureArray(item.contents).map(
            (content, index2) =>
              generateTreeNode(
                content.contentTitle,
                `3-${index1}-${index2}`,
                <span className="iconfont icon-biaoti"></span>,
              ),
          );

          return generateTreeNode(
            item.subtitle,
            `3-${index1}`,
            <span className="iconfont icon-xiangxi"></span>,
            contentTreeData,
          );
        }),
      );
    };

    const treeData = [
      generateTreeNode(
        "标题",
        "1",
        <span className="iconfont icon-biaoti"></span>,
        [generateTreeNode(title, "1-1")],
      ),
      convertPersonalInfo(),
      convertGroupConfig(),
    ];

    return treeData;
  };
}
