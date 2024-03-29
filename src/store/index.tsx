import React from "react";
import UserStore from "./user/UserStore";
import LoginStore from "./login/LoginStore";
import LinkStore from "./link/LinkStore";
import ResumeStore from "./resume/ResumeStore";
import TargetStore from "./target/TargetStore";
import CourseTableStore from "./courseTable/CourseTableStore";
import FileStore from "./file/FileStore";

class RootStore {
  userStore: UserStore;

  loginStore: LoginStore;

  linkStore: LinkStore;

  resumeStore: ResumeStore;

  targetStore: TargetStore;

  courseTableStore: CourseTableStore;

  fileStore: FileStore;

  constructor() {
    // 对引入进行来的子模块进行实例化操作，并挂载到RootStore上
    this.userStore = new UserStore();
    this.loginStore = new LoginStore();
    this.linkStore = new LinkStore();
    this.resumeStore = new ResumeStore();
    this.targetStore = new TargetStore();
    this.courseTableStore = new CourseTableStore();
    this.fileStore = new FileStore();
  }
}

// 实例化操作
const rootStore = new RootStore();
// 这里可以使用React context 完成统一方法的封装需求
const context = React.createContext(rootStore);
// 封装useStore方法，业务组件调用useStore方法便就可以直接获取rootStore
const useStore = () => React.useContext(context);

export default useStore;
