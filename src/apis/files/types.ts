import { RadioProps } from "antd";
import { MongooseDoc } from "@/types";

export type TagType = MongooseDoc & {
  name: string;
};

export type TagGroupConfig = {
  title: string;
  tags: TagType[];
};

export type IFile = MongooseDoc & {
  fileName: string;
  fileType: string;
  filePath: string;
  fileSize: number;
  tags: TagType[];
};

export type findAllTagsRes = TagType[];
export type findAllFilesRes = IFile[];
export type findFileRes = IFile;
export type checkFileUniqueRes = {
  repeatNames: string[];
};
