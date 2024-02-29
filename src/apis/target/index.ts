import LinRequest from "..";
import {
  CreateTargetPayload,
  FindAllTargetRes,
  UpdateTargetPayload,
} from "./types";

export * from "./types";

export const createTarget = (payload: CreateTargetPayload) => {
  return LinRequest.post("target/create", {
    data: payload,
  });
};

export const findAllTarget = () => {
  return LinRequest.post<FindAllTargetRes>("target/findAll");
};

export const updateTarget = (payload: UpdateTargetPayload) => {
  const { targetId, target } = payload;
  return LinRequest.post<FindAllTargetRes>("target/update", {
    params: { targetId },
    data: { target },
  });
};

export const deleteTarget = (targetId: string) => {
  return LinRequest.post<FindAllTargetRes>("target/delete", {
    params: {
      targetId,
    },
  });
};

export const completeStage = (targetId: string, stageId: string) => {
  return LinRequest.post("target/completeStage", {
    data: {
      targetId,
      stageId,
    },
  });
};

export const completeStep = (targetId: string, stageId: string) => {
  return LinRequest.post("target/completeStep", {
    data: {
      targetId,
      stageId,
    },
  });
};
