import React from "react";
import "./index.less";
import { RadioProps } from "antd";
import { MongooseDoc } from "@/types";

export type TagGroupProps = {
  title: string;
  tags: RadioProps[];
};
const TagGroup = (props: TagGroupProps) => {
  return <div className="tag-group">TagGroup</div>;
};

export default TagGroup;
