import { useEffect } from "react";
import "./index.less";
import { Anchor, Button, Form, Input } from "antd";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import LinkCard from "./LinkCard";
import useStore from "@/store";
import { ensureArray, waitAndRefreshPage } from "@/utils";
import { useFormModal } from "@/components/Modal";

type FieldType = {
  cateName?: string;
};

const Link = observer(() => {
  const { linkStore } = useStore();
  const { cates, createCateOpr } = linkStore;
  const navigate = useNavigate();
  useEffect(() => {
    linkStore.findAllCateOpr();
  }, [linkStore]);

  const formModalHandler = useFormModal();

  const handleCreateCate = async (name: string) => {
    await createCateOpr({ name });
    waitAndRefreshPage(navigate, 1);
  };

  const renderFormModalChildren = () => {
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

  return (
    <div className="link-container" style={{ padding: "20px" }}>
      <div className="operation-buttons">
        <Button
          type="primary"
          onClick={() =>
            formModalHandler.open<FieldType>({
              modalProps: {
                title: "添加分类",
                cancelText: "取消",
                okText: "添加",
                onOk: ({ cateName }) => handleCreateCate(cateName ?? ""),
              },
              formChildren: renderFormModalChildren(),
              initialValue: {},
            })
          }
        >
          添加分类
        </Button>
      </div>
      <div className="main-area">
        <Anchor
          rootClassName="anchor"
          items={ensureArray(cates).map((cate) => {
            const { _id, name } = cate;
            return {
              key: _id,
              href: `#${_id}`,
              title: name,
            };
          })}
        />
        <div className="card-item-container">
          {ensureArray(cates).map((cate) => (
            <LinkCard
              key={cate._id}
              title={cate.name}
              categoryId={cate._id}
              links={cate.links}
              bordered={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default Link;
