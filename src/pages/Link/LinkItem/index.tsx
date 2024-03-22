import React, { memo } from "react";
import "./index.less";
import * as cx from "classnames";
import * as _ from "lodash";
import { CloseCircleFilled, EditFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Form, Input, Popconfirm, Radio } from "antd";
import ColorPicker, { Color } from "antd/es/color-picker";
import { Link } from "@/apis/link/types";
import {
  LinkIconDisplayModeEnum,
  formatDirection,
  waitAndRefreshPage,
} from "@/utils";
import { WithMongoId } from "@/types";
import useStore from "@/store";
import { useFormModal } from "@/components/Modal";

type FieldType = Omit<Link, "categoryId" | "bgColor"> & {
  bgColor: Color | string;
};

type IProps = WithMongoId<Link> & {
  isEditLink: boolean;
};

const LinkItem = memo((props: IProps) => {
  const { bgColor, name, direction, displayMode, isEditLink, _id } = props;

  const { linkStore } = useStore();
  const formModalHandler = useFormModal();
  const navigate = useNavigate();

  const { deleteLinkOpr, updateLinkOpr } = linkStore;

  // 是否只展示首字符
  const isFirstChar = displayMode === LinkIconDisplayModeEnum.FirstChar;
  // 字体放大
  const displayModeStyle: React.CSSProperties = {
    fontSize: isFirstChar ? "200%" : undefined,
  };
  // 取首字符
  const truncatedName = isFirstChar ? name.charAt(0) : name;

  /** 打开指向链接 */
  const openLink = () => {
    window.open(formatDirection(direction), "_blank");
  };
  /** 删除链接 */
  const handleDeleteLink = async () => {
    await deleteLinkOpr(_id);
    await waitAndRefreshPage(navigate, 0.5);
  };
  /** 编辑链接 */
  const handleEditLink = async (values: FieldType) => {
    const { bgColor, direction } = values;
    // 转化成 hex
    const hexColor =
      typeof bgColor === "string" ? bgColor : `#${bgColor.toHex()}`;

    await updateLinkOpr({
      ...values,
      bgColor: hexColor,
      direction: _.trim(direction),
      _id,
    });
    await waitAndRefreshPage(navigate, 0.5);
  };
  /** 编辑链接 modalForm */
  const renderFormModalChildren = () => {
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

  return (
    <div className="link-item-container">
      <div
        className={cx("link-item", {
          "is-editing": isEditLink,
        })}
        style={{
          backgroundColor: bgColor,
        }}
        onClick={isEditLink ? undefined : openLink}
      >
        <span className="name" style={displayModeStyle}>
          {truncatedName}
        </span>
      </div>
      {isEditLink ? (
        <>
          <span
            className="operation-button edit-button"
            onClick={() =>
              formModalHandler.open<FieldType>({
                modalProps: {
                  title: "编辑链接",
                  onOk: (values) => handleEditLink(values),
                },
                formChildren: renderFormModalChildren(),
                initialValue: { bgColor, displayMode, name, direction },
              })
            }
          >
            <EditFilled />
          </span>
          <Popconfirm
            title="删除链接"
            description="你确定要删除这个链接吗？"
            onConfirm={handleDeleteLink}
            okText="是"
            cancelText="否"
          >
            <span className="operation-button delete-button">
              <CloseCircleFilled />
            </span>
          </Popconfirm>
        </>
      ) : null}
    </div>
  );
});

export default LinkItem;
