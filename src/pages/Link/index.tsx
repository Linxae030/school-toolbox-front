import React, { useEffect, useState } from "react";
import "./index.less";
import { Anchor, Button, Form, Input, Modal } from "antd";
import { observer } from "mobx-react-lite";
import LinkCard from "./LinkCard";
import useStore from "@/store";
import { ensureArray, handleResponse, wait } from "@/utils";
import { useFormModal } from "@/components/Modal";
import { useLocation, useNavigate } from "react-router-dom";

type FieldType = {
  cateName?: string;
};

const Link = observer(() => {
  const { linkStore } = useStore();
  const { cates, createCateOpr } = linkStore;
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    linkStore.findAllCateOpr();
  }, []);

  const [handler] = useFormModal<FieldType>();

  return (
    <div id="link-c" className="link-container" style={{ padding: "20px" }}>
      <div className="operation-buttons">
        <Button
          type="primary"
          onClick={() =>
            handler.open({
              modalProps: {
                title: "添加分类",
                onOk: async (values) => {
                  const { cateName } = values;
                  await createCateOpr({ name: cateName ?? "" });
                  await wait(1);
                  // TODO: 别这么刷新
                  window.location.reload();
                },
              },
              formChildren: (
                <Form>
                  <Form.Item name="cateName">
                    <Input placeholder="请输入分类名" />
                  </Form.Item>
                </Form>
              ),
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
        <div className="part-item-container">
          {ensureArray(cates).map((cate) => (
            <LinkCard key={cate._id} title={cate.name} bordered={false} />
          ))}
        </div>
      </div>
    </div>
  );
});

export default Link;
