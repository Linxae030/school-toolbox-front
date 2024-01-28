import React from "react";
import UserStore from "./user/UserStore";
import LoginStore from "./login/LoginStore";

class RootStore {
  userStore: UserStore;

  loginStore: LoginStore;

  constructor() {
    // 对引入进行来的子模块进行实例化操作，并挂载到RootStore上
    this.userStore = new UserStore();
    this.loginStore = new LoginStore();
  }
}

// 实例化操作
const rootStore = new RootStore();
// 这里可以使用React context 完成统一方法的封装需求
const context = React.createContext(rootStore);
// 封装useStore方法，业务组件调用useStore方法便就可以直接获取rootStore
const useStore = () => React.useContext(context);

export default useStore;
