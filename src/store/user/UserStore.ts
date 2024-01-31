import { makeAutoObservable, runInAction } from "mobx";
import { message } from "antd";
import { getUserProfile } from "@/apis";

export default class UserStore {
  nickname!: string;

  account!: string;

  token!: string;

  constructor() {
    makeAutoObservable(this);
  }

  initUserProfile = async () => {
    const res = await getUserProfile();
    if (res.code === 1) {
      const { data } = res;
      const { nickname, account } = data;
      runInAction(() => {
        this.nickname = nickname;
        this.account = account;
      });
    } else {
      message.error(res.ret);
    }
  };
}
