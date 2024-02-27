import { StepsProps, TimelineProps, TimelineItemProps } from "antd";
import { MongooseDoc } from "@/types";

type StageBaseProps = TimelineItemProps;

export enum StageStatus {
  DOING = "green",
  DONE = "blue",
  TODO = "gray",
  FAIL = "red",
}

export interface StageStepConfig extends StepsProps {}

export interface Stage extends StageBaseProps {
  // /** 阶段名称 */
  // stageName: string;
  // /** 阶段内容 */
  // stageContent: string;
  // /** 阶段描述 */
  // stageDesc: string;
  // /** 阶段时间范围 */
  // stageTimeRange: string[];
  innerStepConfig?: StageStepConfig;
}

export interface Target extends MongooseDoc {
  /** 所属用户 */
  user: string;
  /** 目标名称 */
  targetName: string;
  /** 目标阶段数组 */
  stages: Stage[];
}
