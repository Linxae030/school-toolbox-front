import { UploadFile } from "antd";
import LinRequest from "..";
import {
  checkFileUniqueRes,
  findAllFilesRes,
  findAllTagsRes,
  findFileRes,
} from "./types";
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

export const findFile = (_id: string) => {
  return LinRequest.post<findFileRes>("file/findFile", {
    params: {
      _id,
    },
  });
};

export const findFiles = (tags: string[]) => {
  return LinRequest.post<findAllFilesRes>("file/findFiles", {
    data: { tags },
  });
};

export const deleteFile = (_id: string) => {
  return LinRequest.post("file/deleteFile", {
    params: {
      _id,
    },
  });
};

export const deleteFiles = (ids: string[]) => {
  return LinRequest.post("file/deleteFiles", {
    data: {
      ids,
    },
  });
};

export const downloadFile = (_id: string) => {
  window.location.href = `http://localhost:3000/file/downloadFile?_id=${_id}`;
};

export const downloadFiles = async (
  ids: string[],
  zipName: string = "default",
) => {
  const res = await fetch("http://localhost:3000/file/downloadFiles", {
    method: "POST",
    body: JSON.stringify({
      ids,
    }),
    headers: {
      // 请求头
      "content-type": "application/json",
    },
  }).then((res) => res.arrayBuffer());
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([res]));
  a.download = `${zipName}.zip`;
  a.click();
};

export const checkFileUnique = (fileNames: string[]) => {
  return LinRequest.post<checkFileUniqueRes>("file/checkFileUnique", {
    data: {
      fileNames,
    },
  });
};
