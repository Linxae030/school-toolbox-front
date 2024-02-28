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
