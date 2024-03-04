import LinRequest from "..";
import {
  CreateLinkPayload,
  DeleteCoursePayload,
  FindAllCourseRes,
  UpdateCoursePayload,
} from "./types";

export const findAllCourses = () => {
  return LinRequest.post<FindAllCourseRes>("course/findAll");
};

export const createCourse = (payload: CreateLinkPayload) => {
  return LinRequest.post("course/create", {
    data: payload,
  });
};

export const deleteCourse = (payload: DeleteCoursePayload) => {
  return LinRequest.post("course/delete", {
    data: payload,
  });
};

export const updateCourse = (payload: UpdateCoursePayload) => {
  return LinRequest.post("course/update", {
    data: payload,
  });
};
