import LinRequest from "../index";
import type {
  CreateCatePayload,
  CreateLinkPayload,
  FindAllCateRes,
  UpdateCateRes,
  UpdateLinkPayload,
  UpdateLinkRes,
} from "./types";

/** link */
export const createLink = (payload: CreateLinkPayload) => {
  return LinRequest.post("link/createLink", {
    data: payload,
  });
};

export const updateLink = (payload: UpdateLinkPayload) => {
  const { _id, ...rest } = payload;
  return LinRequest.post<UpdateLinkRes>("link/updateLink", {
    data: rest,
    params: { _id },
  });
};

export const deleteLink = (_id: string) => {
  return LinRequest.post("link/deleteLink", {
    params: { _id },
  });
};
/** cate */
export const findAllCate = () => {
  return LinRequest.post<FindAllCateRes>("link/findAllCate");
};

export const createCate = (payload: CreateCatePayload) => {
  return LinRequest.post("link/createCate", {
    data: payload,
  });
};

export const updateCate = (payload: UpdateLinkPayload) => {
  const { _id, ...rest } = payload;
  return LinRequest.post<UpdateCateRes>("link/updateCate", {
    data: rest,
    params: { _id },
  });
};

export const deleteCate = (_id: string) => {
  return LinRequest.post("link/deleteCate", {
    params: { _id },
  });
};
