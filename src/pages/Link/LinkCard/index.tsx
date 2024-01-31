import React, { memo, useState } from "react";
import "./index.less";
import {
  Card,
  CardProps,
  ColorPicker,
  Form,
  Input,
  Popconfirm,
  Radio,
} from "antd";
import { useNavigate } from "react-router-dom";
import { Color } from "antd/es/color-picker";
import { EditOutlined } from "@ant-design/icons";
import { useFormModal } from "@/components/Modal";
import {
  LinkIconDisplayModeEnum,
  ensureArray,
  formatDirection,
  waitAndRefreshPage,
} from "@/utils";
import { Link } from "@/apis/link/types";
import { OmitAccount, WithMongoId } from "@/types";
import useStore from "@/store";
import LinkItem from "../LinkItem";

type IProps = CardProps & {
  links?: WithMongoId<Link>[];
  categoryId: string;
};

type LinkItemFieldType = Omit<OmitAccount<Link>, "categoryId" | "bgColor"> & {
  bgColor: Color | string;
};

type CateFieldType = {
  cateName?: string;
};

const gridStyle: React.CSSProperties = {
  textAlign: "center",
  minWidth: "70px",
  maxWidth: "80px",
  padding: "0",
  aspectRatio: "1/1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const LinkCard = memo((props: IProps) => {
  const { title, categoryId, links } = props;

  const { linkStore, userStore } = useStore();
  const navigate = useNavigate();

  const { deleteCateOpr, updateCateOpr, createLinkOpr } = linkStore;
  const { account } = userStore;

  const [isEditLink, setIsEditLink] = useState(false);

  const linkFormModalHandler = useFormModal<LinkItemFieldType>();
  const cateFormModalHandler = useFormModal<CateFieldType>();

  /** 创建链接 */
  const handleCreateLink = async (values: LinkItemFieldType) => {
    const { bgColor, direction } = values;
    // 转化成 hex
    const hexColor =
      typeof bgColor === "string" ? bgColor : `#${bgColor.toHex()}`;

    await createLinkOpr({
      ...values,
      bgColor: hexColor,
      direction,
      categoryId,
      account,
    });

    await waitAndRefreshPage(navigate, 1);
  };
  /** 删除分类 */
  const handleDeleteCate = async () => {
    await deleteCateOpr(categoryId);
    waitAndRefreshPage(navigate, 1);
  };
  /** 编辑分类 */
  const handleEditCate = async (name: string) => {
    await updateCateOpr({ name, _id: categoryId });
    waitAndRefreshPage(navigate, 1);
  };
  /** 创建链接 modalForm */
  const renderLinkFormModalChildren = () => {
    return (
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="地址"
          name="direction"
          rules={[{ required: true, message: "请输入链接地址" }]}
        >
          <Input addonBefore="https://" />
        </Form.Item>
        <Form.Item
          label="名称"
          name="name"
          rules={[{ required: true, message: "请输入链接名称" }]}
        >
          <Input placeholder="请输入链接名" showCount maxLength={8} />
        </Form.Item>
        <Form.Item label="图标颜色" name="bgColor">
          <ColorPicker showText defaultFormat="hex" />
        </Form.Item>
        <Form.Item label="展示模式" name="displayMode">
          <Radio.Group>
            <Radio value={LinkIconDisplayModeEnum.FirstChar}>首字母</Radio>
            <Radio value={LinkIconDisplayModeEnum.Full}>全展示</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    );
  };
  /** 编辑分类 modalForm */
  const renderCateFormModalChildren = () => {
    return (
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="名称"
          name="cateName"
          rules={[{ required: true, message: "请输入分类名称" }]}
        >
          <Input placeholder="请输入分类名" showCount maxLength={8} />
        </Form.Item>
      </Form>
    );
  };
  /** card 额外操作 */
  const renderCardExtraContent = () => {
    return (
      <span>
        <a
          onClick={() =>
            linkFormModalHandler.open({
              modalProps: {
                title: "添加链接",
                cancelText: "取消",
                okText: "添加",
                onOk: (values) => handleCreateLink(values),
              },
              formChildren: renderLinkFormModalChildren(),
              initialValue: {
                bgColor: "#1677ff",
                displayMode: LinkIconDisplayModeEnum.FirstChar,
              },
            })
          }
        >
          添加链接
        </a>
        {isEditLink ? (
          <a
            style={{
              marginLeft: 10,
            }}
            onClick={() => setIsEditLink(false)}
          >
            退出编辑
          </a>
        ) : (
          <a
            style={{
              marginLeft: 10,
            }}
            onClick={() => setIsEditLink(true)}
          >
            编辑链接
          </a>
        )}

        <Popconfirm
          title="删除分类"
          description="你确定要删除这个分类吗？"
          onConfirm={handleDeleteCate}
          okText="是"
          cancelText="否"
        >
          <a
            style={{
              marginLeft: 10,
            }}
          >
            删除分类
          </a>
        </Popconfirm>
      </span>
    );
  };
  /** card 标题 */
  const renderCardTitle = () => {
    return (
      <span className="card-title">
        <span>{title}</span>
        <span
          className="edit-button"
          onClick={() =>
            cateFormModalHandler.open({
              modalProps: {
                title: "编辑分类",
                cancelText: "取消",
                okText: "修改",
                onOk: ({ cateName }) => handleEditCate(cateName ?? ""),
              },
              formChildren: renderCateFormModalChildren(),
              initialValue: { cateName: title as string },
            })
          }
        >
          <EditOutlined />
        </span>
      </span>
    );
  };

  return (
    <div className="link-card">
      <Card
        id={`${categoryId}`}
        title={renderCardTitle()}
        extra={renderCardExtraContent()}
      >
        {ensureArray(links).map((link) => (
          <Card.Grid key={link._id} style={gridStyle} hoverable={false}>
            <LinkItem {...link} isEditLink={isEditLink}></LinkItem>
          </Card.Grid>
        ))}
      </Card>
    </div>
  );
});

export default LinkCard;
