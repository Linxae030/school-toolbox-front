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
  icon: string;
  content: T;
}

export type TextContent = string;
export type ListContent = string[];
export type TagContent = string;

/** 分组内容详情 */
export interface GroupDetail {
  /** 详情标题 */
  detailTitle: string;
  /** 详情内容 */
  detailContent: TextContent | ListContent;
}

/** 内容项时间范围 */
export interface TimeRange {
  /** 起始时间 */
  start: string;
  /** 结束时间 */
  end: string | "至今";
}

/** 分组内容配置 */
export interface GroupContent {
  /** 内容标题 */
  contentTitle: string;
  /** 内容标签 */
  tags?: TagContent[];
  /** 内容时间范围 */
  timeRange?: TimeRange;
  /** 内容详情 */
  detail: GroupDetail;
}

/** 分组配置 */
export interface GroupConfig {
  /** 分组标题 */
  subtitle: string;
  /** 分组内容 */
  content: GroupContent[];
}

/** 个人信息 */
export interface PersonalInfo {
  /** 姓名 */
  name?: WithIcon<string>;
  /** 性别 */
  gender?: WithIcon<Gender>;
  /** 微信号 */
  weChat?: WithIcon<string>;
  /** 手机号 */
  telephone?: WithIcon<string>;
  /** 邮箱 */
  email?: WithIcon<string>;
  /** 链接 */
  links?: WithIcon<string>[];
}

/** 简历配置 */
export interface ResumeConfig {
  /** 模板选择 */
  template: string;
  /** 简历标题 */
  title: string;
  /** 分组配置 */
  groupConfig: GroupConfig[];
  /** 个人信息 */
  personalInfo: DividedPart<PersonalInfo>;
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
