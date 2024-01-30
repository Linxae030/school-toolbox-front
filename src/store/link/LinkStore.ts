import { makeAutoObservable, runInAction } from "mobx";
import { message } from "antd";
import {
  CreateCatePayload,
  CreateLinkPayload,
  Link,
  LinkCate,
} from "@/apis/link/types";
import { createCate, createLink, findAllCate } from "@/apis";
import { checkResponseSuccess, handleResponse } from "@/utils/utils";
import { WithMongoId } from "@/types";

export default class LinkStore {
  cates!: WithMongoId<LinkCate>[];

  constructor() {
    makeAutoObservable(this);
  }

  findAllCateOpr = async () => {
    const res = await findAllCate();
    return handleResponse(
      res,
      (res) => {
        runInAction(() => {
          const { data } = res;
          this.cates = data;
        });
      },
      (res) => {
        const { ret } = res;
        message.error(ret);
      },
    );
  };

  /** 创建链接 */
  createLinkOpr = async (payload: CreateLinkPayload) => {
    const res = await createLink(payload);
  };

  /** 创建分类 */
  createCateOpr = async (payload: CreateCatePayload) => {
    const res = await createCate(payload);
    return handleResponse(
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
