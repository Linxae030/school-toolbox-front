import { autorun, makeAutoObservable } from "mobx";
import { message } from "antd";
import * as _ from "lodash";
import dayjs from "dayjs";
import { Stage, StageStatus, Target } from "@/apis/target/types";
import {
  completeStage,
  completeStep,
  createTarget,
  deleteTarget,
  findAllTarget,
  updateTarget,
} from "@/apis/target";
import { handleResponse } from "@/utils";

export default class TargetStore {
  currentTargetId!: string;

  currentTarget: Target = {} as Target;

  targetList: Target[] = [];

  constructor() {
    makeAutoObservable(this);
    // currentId 改变重新渲染
    autorun(() => {
      const findTarget = this.targetList.find(
        (target) => target._id === this.currentTargetId,
      );
      if (findTarget) this.setCurrentTarget(findTarget);
      // else this.setCurrentTarget(_defaultTarget as Target);
    });
  }

  setCurrentTarget = (target: Target) => {
    this.currentTarget = target;
  };

  setCurrentTargetId = (id: string) => {
    this.currentTargetId = id;
  };

  /** 修改当前目标数据 */
  modifyTargetData = (path: string, newValue: any) => {
    const newTargetData = _.cloneDeep(this.currentTarget);
    _.set(newTargetData, path, newValue);
    this.setCurrentTarget(newTargetData);
  };

  pushNewStep = (index: number) => {
    const { innerStepConfig } = this.currentTarget.stages[index];
    if (innerStepConfig) {
      innerStepConfig.items?.push({});
    } else {
      this.currentTarget.stages[index].innerStepConfig = {
        current: 0,
        items: [{}],
      };
    }

    this.setCurrentTarget(this.currentTarget);
  };

  pushNewStage = () => {
    this.currentTarget.stages.push({
      stageName: "新阶段",
      stageTime: dayjs().format("YYYY.MM.DD"),
      status: StageStatus.TODO,
    } as Stage);
    this.setCurrentTarget(this.currentTarget);
  };

  removeStage = (index: number) => {
    this.currentTarget.stages.splice(index, 1);
    this.setCurrentTarget(this.currentTarget);
  };

  removeStep = (stageIndex: number, stepIndex: number) => {
    this.currentTarget.stages[stageIndex].innerStepConfig?.items?.splice(
      stepIndex,
      1,
    );
    this.currentTarget.stages[stageIndex].innerStepConfig!.current = 0;
    this.setCurrentTarget(this.currentTarget);
  };

  createTargetOpr = async (targetName: string) => {
    const res = await createTarget({ targetName });
    handleResponse(
      res,
      (res) => {
        message.success(res.msg);
      },
      (res) => {
        const { ret } = res;
        message.error(ret);
      },
    );
  };

  findAllTargetOpr = async () => {
    const res = await findAllTarget();
    handleResponse(
      res,
      (res) => {
        this.targetList = res.data;
        if (this.targetList.length > 0) {
          const first = this.targetList[0];
          this.currentTargetId = first._id;
        }
      },
      (res) => {
        const { ret } = res;
        message.error(ret);
      },
    );
  };

  updateTargetOpr = async () => {
    const res = await updateTarget({
      targetId: this.currentTargetId,
      target: this.currentTarget,
    });
    handleResponse(
      res,
      (res) => {
        message.success(res.msg);
      },
      (res) => {
        const { ret } = res;
        message.error(ret);
      },
    );
  };

  deleteTargetOpr = async (targetId: string) => {
    const res = await deleteTarget(targetId);
    handleResponse(
      res,
      (res) => {
        message.success(res.msg);
      },
      (res) => {
        const { ret } = res;
        message.error(ret);
      },
    );
  };

  completeStageOpr = async (targetId: string, stageId: string) => {
    const res = await completeStage(targetId, stageId);
    handleResponse(
      res,
      (res) => {
        message.success(res.msg);
      },
      (res) => {
        const { ret } = res;
        message.error(ret);
      },
    );
  };

  completeStepOpr = async (targetId: string, stageId: string) => {
    const res = await completeStep(targetId, stageId);
    handleResponse(
      res,
      (res) => {
        message.success(res.msg);
      },
      (res) => {
        const { ret } = res;
        message.error(ret);
      },
    );
  };
}
