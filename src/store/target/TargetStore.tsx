import { makeAutoObservable, toJS } from "mobx";
import { Steps } from "antd";
import { StageStatus, Target } from "@/apis/target/types";
import StageStep from "@/pages/Target/StageStep";

const defaultTarget: Target = {
  _id: "1",
  createdAt: "2021-07-01",
  updatedAt: "2021-07-01",
  user: "linxae",
  targetName: "大四下春招计划",
  stages: [
    {
      children: "复习数据结构",
      label: "2024-02-24",
      color: StageStatus.DOING,
      innerStepConfig: {
        current: 1,
        items: [
          {
            title: "线性表",
            description: "复习线性表",
          },
          {
            title: "树",
            description: "复习树",
          },
          {
            title: "图",
            description: "复习图",
          },
        ],
      },
    },
    {
      children: "复习前端知识点",
      label: "2024-03-01",
      color: StageStatus.TODO,
      innerStepConfig: {
        current: 1,
        items: [
          {
            title: "复习八股文",
          },
          {
            title: "复习手写代码",
          },
        ],
      },
    },
    {
      children: "简历投递",
      label: "2024-03-08",
      color: StageStatus.TODO,
    },
    {
      children: "准备面试",
      label: "2024-03-12",
      color: StageStatus.TODO,
    },
    {
      children: "简历投递",
      label: "2024-03-08",
      color: StageStatus.TODO,
    },
    {
      children: "准备面试",
      label: "2024-03-12",
      color: StageStatus.TODO,
    },
    {
      children: "简历投递",
      label: "2024-03-08",
      color: StageStatus.TODO,
    },
    {
      children: "准备面试",
      label: "2024-03-12",
      color: StageStatus.TODO,
    },
    {
      children: "简历投递",
      label: "2024-03-08",
      color: StageStatus.TODO,
    },
    {
      children: "准备面试",
      label: "2024-03-12",
      color: StageStatus.TODO,
    },
  ],
};
const _defaultTarget: Target = {
  _id: "2",
  createdAt: "2021-07-01",
  updatedAt: "2021-07-01",
  user: "linxae",
  targetName: "社招计划",
  stages: [
    {
      children: "复习结构",
      label: "2024-02-24",
      color: StageStatus.DOING,
      innerStepConfig: {
        items: [
          {
            title: "线性表",
            description: "复习线性表",
          },
          {
            title: "树",
            description: "复习树",
          },
          {
            title: "图",
            description: "复习图",
          },
        ],
      },
    },
    {
      children: "复习前端知识点",
      label: "2024-03-01",
      color: StageStatus.TODO,
      innerStepConfig: {
        current: 1,
        items: [
          {
            title: "复习八股文",
          },
          {
            title: "复习手写代码",
          },
        ],
      },
    },
    {
      children: "简历投递",
      label: "2024-03-08",
      color: StageStatus.TODO,
    },
    {
      children: "准备面试",
      label: "2024-03-12",
      color: StageStatus.TODO,
    },
    {
      children: "简历投递",
      label: "2024-03-08",
      color: StageStatus.TODO,
    },
    {
      children: "准备面试",
      label: "2024-03-12",
      color: StageStatus.TODO,
    },
    {
      children: "简历投递",
      label: "2024-03-08",
      color: StageStatus.TODO,
    },
    {
      children: "准备面试",
      label: "2024-03-12",
      color: StageStatus.TODO,
    },
    {
      children: "简历投递",
      label: "2024-03-08",
      color: StageStatus.TODO,
    },
    {
      children: "准备面试",
      label: "2024-03-12",
      color: StageStatus.TODO,
    },
  ],
};

const defaultTargetList = [defaultTarget, _defaultTarget];

export default class TargetStore {
  currentTargetId: string = "1";

  targetList: Target[] = defaultTargetList;

  constructor() {
    makeAutoObservable(this);
  }

  get currentTarget() {
    return this.formatTarget(
      this.targetList.find((item) => item._id === this.currentTargetId) ??
        this.targetList[0],
    );
  }

  setCurrentTargetId = (id: string) => {
    this.currentTargetId = id;
  };

  formatTarget = (target: Target) => {
    const { stages } = target;
    target.stages = stages.map((stage) => {
      const { innerStepConfig, children: title, ...restProps } = stage;
      if (innerStepConfig) {
        const formattedStage = {
          ...restProps,
          children: <StageStep title={title} config={innerStepConfig} />,
        };
        return formattedStage;
      }
      return stage;
    });
    return target;
  };
}
