import { UploadFile } from "antd";
import LinRequest from "..";
import { findAllFilesRes, findAllTagsRes } from "./types";
/** link */
export const addTag = (name: string) => {
  return LinRequest.post("file/addTag", {
    params: {
      name,
    },
  });
};

export const findAllTags = () => {
  return LinRequest.post<findAllTagsRes>("file/findAllTags");
};

export const updateTag = (name: string, _id: string) => {
  return LinRequest.post("file/updateTag", {
    data: {
      _id,
      name,
    },
  });
};

export const deleteTag = (_id: string) => {
  return LinRequest.post("file/deleteTag", {
    params: {
      _id,
    },
  });
};

export const uploadFiles = (formData: any) => {
  return LinRequest.post("file/uploadFiles", {
    data: formData,
  });
};

export const findFiles = (tags: string[]) => {
  return LinRequest.post<findAllFilesRes>("file/findFiles", {
    data: { tags },
  });
};
