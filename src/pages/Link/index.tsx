import React from "react";
import "./index.less";
import { Anchor } from "antd";

const Link = () => {
  return (
    <div className="link-container" style={{ padding: "20px" }}>
      <div className=""></div>
      <Anchor
        className="anchor"
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
        <div className="link-part-item">
          <h1 id="part-1">学习链接</h1>
          <div style={{ height: "500px", backgroundColor: "red" }}></div>
        </div>
        <div className="link-part-item">
          <h1 id="part-2">学校链接</h1>
          <div style={{ height: "500px", backgroundColor: "red" }}></div>
        </div>
        <div className="link-part-item">
          <h1 id="part-3">工作链接</h1>
          <div style={{ height: "500px", backgroundColor: "red" }}></div>
        </div>
      </div>
    </div>
  );
};

export default Link;
