import { RadioProps } from "antd";

export type TagType = string;

export type TagGroupConfig = {
  title: string;
  tags: TagType[];
};

export type File = {
  fileName: string;
  fileSize: string;
  tags: TagType[];
};
