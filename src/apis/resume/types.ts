import { MongooseDoc } from "@/types";

/** 性别 */
export enum Gender {
  /** 男 0 */
  Male,
  /** 女 1 */
  Female,
}

export interface DividedPart<T> {
  leftPart: T;
  rightPart: T;
}

export interface WithIcon<T> {
  icon?: string;
  content: T;
  clickAble?: boolean;
}

export type TextContent = string;
export type ListContent = string[];
export type TagContent = string;

/** 分组内容详情 */
// export interface GroupDetail {
//   /** 详情标题 */
//   detailTitle: string;
//   /** 详情内容 */
//   detailContent: TextContent | ListContent;
// }

export type GroupDetail = ListContent;
export type GroupDesc = ListContent;

/** 内容项时间范围 */
export type TimeRange = string[];

/** 分组内容配置 */
export interface GroupContent {
  /** 内容标题 */
  contentTitle?: string;
  /** 内容标签 */
  tags?: TagContent[];
  /** 内容时间范围 */
  timeRange?: TimeRange;
  /** 内容详情 */
  detail?: GroupDetail;
  /** 内容描述 */
  description?: GroupDesc;
}

/** 分组配置 */
export interface GroupConfig {
  /** 分组标题 */
  subtitle: string;
  /** 分组内容 */
  contents: GroupContent[];
}

/** 简历配置 */
export interface ResumeConfig {
  /** 简历标题 */
  title: string;
  /** 分组配置 */
  groupConfig: GroupConfig[];
  /** 个人信息 */
  personalInfo: DividedPart<WithIcon<string>[]>;
}

/** 简历 */
export interface Resume extends MongooseDoc {
  /** 所属用户 */
  user: string;
  /** 简历名称 */
  name: string;
  /** 简历版本 */
  version: string;
  /** 父本id */
  parentId?: string;
  /** 简历配置 */
  resumeConfig: ResumeConfig;
}
