import React from "react";
import "./index.less";
import { Checkbox, CheckboxOptionType, Radio, RadioProps, Space } from "antd";
import { MongooseDoc } from "@/types";
import { mapRender } from "../../../utils/utils";
import TagGroup, { TagGroupProps } from "../TagGroup";
import { TagType } from "@/apis/files/types";

type IProps = {
  isEditing: boolean;
  tags: TagType[];
};

const FileTagList = (props: IProps) => {
  const { tags, isEditing } = props;

  const options: CheckboxOptionType[] = tags?.map((tag) => ({
    label: tag,
    value: tag,
  }));

  return (
    <div className="file-tag-list">
      <h1 className="side-title">文件标签</h1>
      <Checkbox.Group style={{ width: "100%" }}>
        <Space direction="vertical">
          {mapRender(options, (option) => (
            <div className="tag-row">
              {isEditing ? (
                <span>{option.label}</span>
              ) : (
                <Checkbox value={option.value}>{option.label}</Checkbox>
              )}
            </div>
          ))}
        </Space>
      </Checkbox.Group>
    </div>
  );
};

export default FileTagList;
