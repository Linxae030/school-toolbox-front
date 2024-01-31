import { makeAutoObservable, runInAction } from "mobx";
import { message } from "antd";
import {
  CreateCatePayload,
  CreateLinkPayload,
  LinkCate,
  UpdateLinkPayload,
} from "@/apis/link/types";
import {
  createCate,
  createLink,
  deleteCate,
  deleteLink,
  findAllCate,
  updateCate,
  updateLink,
} from "@/apis";
import { handleResponse } from "@/utils/utils";
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

  /** 删除链接 */
  deleteLinkOpr = async (payload: string) => {
    const res = await deleteLink(payload);
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

  /** 更新链接 */
  updateLinkOpr = async (payload: UpdateLinkPayload) => {
    const res = await updateLink(payload);
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

  /** 删除分类 */
  deleteCateOpr = async (payload: string) => {
    const res = await deleteCate(payload);
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

  /** 更新分类 */
  updateCateOpr = async (payload: UpdateLinkPayload) => {
    const res = await updateCate(payload);
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
