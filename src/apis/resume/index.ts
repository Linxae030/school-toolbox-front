import LinRequest from "..";
import {
  CreateResumePayload,
  FindAllResumeRes,
  FindOneResumeRes,
  UpdateResumePayload,
} from "./types";

export * from "./types";

export const findAllResume = () => {
  return LinRequest.post<FindAllResumeRes>("resume/findAll");
};

export const findOneResume = (_id: string) => {
  return LinRequest.post<FindOneResumeRes>("resume/findOne", {
    params: { _id },
  });
};

export const createResume = (payload: CreateResumePayload) => {
  return LinRequest.post("resume/create", {
    data: payload,
  });
};

export const updateResume = (payload: UpdateResumePayload) => {
  const { _id, ...rest } = payload;
  return LinRequest.post("resume/update", {
    data: rest,
    params: { _id },
  });
};

export const deleteResume = (_id: string) => {
  return LinRequest.post("resume/delete", {
    params: { _id },
  });
};
