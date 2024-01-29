import { makeAutoObservable, runInAction } from "mobx";
import { message } from "antd";
import { getUserProfile } from "@/apis";

export default class UserStore {
  nickname!: string;

  token!: string;

  constructor() {
    makeAutoObservable(this);
  }

  setNickname = (nickname: string) => {
    this.nickname = nickname;
  };

  initUserProfile = async () => {
    const res = await getUserProfile();
    if (res.code === 1) {
      const { data } = res;
      const { nickname } = data;
      runInAction(() => {
        this.nickname = nickname;
        console.log("set", this.nickname);
      });
    } else {
      message.error(res.ret);
    }
  };
}
