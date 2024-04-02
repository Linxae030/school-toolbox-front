import { makeAutoObservable, runInAction } from "mobx";
import { message, UploadFile } from "antd";
import * as _ from "lodash";
import { IFile, TagType } from "@/apis/files/types";
import {
  addTag,
  deleteTag,
  findAllTags,
  findFiles,
  updateTag,
  uploadFiles,
} from "@/apis/files";
import { handleResponse } from "@/utils";

export default class FileStore {
  files: IFile[] = [];

  tags: TagType[] = [];

  selectedIds: string[] = [];

  get selectedTags() {
    return this.tags.filter((tag) => this.selectedIds.includes(tag._id));
  }

  constructor() {
    makeAutoObservable(this);
  }

  updateSelectedIds = (ids: string[]) => {
    this.selectedIds = ids;
  };

  findAllTagsOpr = async () => {
    const res = await findAllTags();
    handleResponse(
      res,
      (res) => {
        runInAction(() => {
          this.tags = res.data;
        });
      },
      (res) => {
        const { ret } = res;
        message.error(ret);
      },
    );
  };

  addTagOpr = async (name: string) => {
    const res = await addTag(name);
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

  updateTagOpr = async (name: string, _id: string) => {
    const res = await updateTag(name, _id);
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

  deleteTagOpr = async (_id: string) => {
    const res = await deleteTag(_id);
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

  uploadFilesOpr = async (formData: any) => {
    const res = await uploadFiles(formData);
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

  findFilesOpr = _.debounce(async (tags: string[], cb?: any) => {
    const res = await findFiles(tags);
    handleResponse(
      res,
      (res) => {
        runInAction(() => {
          this.files = res.data;
        });
        cb?.();
      },
      (res) => {
        const { ret } = res;
        message.error(ret);
        cb?.();
      },
    );
  }, 1000);
}
