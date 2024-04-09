import { makeAutoObservable, runInAction } from "mobx";
import { message, UploadFile } from "antd";
import * as _ from "lodash";
import { IFile, TagType } from "@/apis/files/types";
import {
  addTag,
  deleteFile,
  deleteFiles,
  deleteTag,
  downloadFile,
  downloadFiles,
  findAllTags,
  findFile,
  findFiles,
  updateFile,
  updateTag,
  uploadFiles,
} from "@/apis/files";
import { ensureArray, handleResponse } from "@/utils";

export type FilterCondition = {
  [K in keyof IFile | "keywords"]?: K extends keyof IFile
    ? "desc" | "asc"
    : string;
};

export default class FileStore {
  files: IFile[] = [];

  tags: TagType[] = [];

  selectedTagIds: string[] = [];

  selectedFileIds: string[] = [];

  filterCondition: FilterCondition = {};

  get selectedTags() {
    return this.tags.filter((tag) => this.selectedTagIds.includes(tag._id));
  }

  get filteredFiles(): IFile[] {
    const { keywords, ...filterProps } = this.filterCondition;
    let filteredFiles = this.files;

    if (keywords) {
      filteredFiles = filteredFiles.filter((file) =>
        file.fileName.includes(keywords),
      );
    }
    const entries = Object.entries(filterProps);
    if (entries.length === 0) return filteredFiles;
    const [key, value] = entries[0];
    filteredFiles = _.orderBy(filteredFiles, key, value);

    return filteredFiles;
  }

  constructor() {
    makeAutoObservable(this);
  }

  setFilerCondition = (condition: FilterCondition) => {
    this.filterCondition = condition;
  };

  updateSelectedTagIds = (ids: string[]) => {
    this.selectedTagIds = ids;
  };

  updateSelectedFileIds = (ids: string[]) => {
    this.selectedFileIds = ids;
  };

  checkFile = (id: string) => {
    this.selectedFileIds = [...new Set([...this.selectedFileIds, id])];
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

  deleteFileOpr = async (_id: string) => {
    const res = await deleteFile(_id);
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

  deleteFilesOpr = async () => {
    const res = await deleteFiles(this.selectedFileIds);
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

  downloadFileOpr = async (_id: string) => {
    downloadFile(_id);
  };

  downloadFilesOpr = async (ids: string[], zipName: string) => {
    await downloadFiles(ids, zipName);
  };

  updateFileOpr = async (_id: string, fileName: string, tags: string[]) => {
    const res = await updateFile(_id, fileName, tags);
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

  resetData = () => {
    this.selectedTagIds = [];
    this.selectedFileIds = [];
  };
}
