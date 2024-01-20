import React from "react";
import "./index.less";
import { Anchor, Button } from "antd";
import LinkCard from "./LinkCard";

const Link = () => {
  return (
    <div className="link-container" style={{ padding: "20px" }}>
      <div className="operation-buttons">
        <Button type="primary">添加分类</Button>
      </div>
      <div className="main-area">
        <Anchor
          rootClassName="anchor"
          items={[
            {
              key: "part-1",
              href: "#part-1",
              title: "学习链接",
            },
            {
              key: "part-2",
              href: "#part-2",
              title: "学校链接",
            },
            {
              key: "part-3",
              href: "#part-3",
              title: "工作链接",
            },
          ]}
        />
        <div className="part-item-container">
          <LinkCard title="学习链接" bordered={false} />
        </div>
      </div>
    </div>
  );
};

export default Link;
