import React from "react";
import { observer } from "mobx-react-lite";
import ResumePreviewer from "./ResumePreviewer";
import { ResumeConfig } from "@/apis/resume";
import "./edit.less";
import ConfigFormTree from "./ConfigFormTree";
import useStore from "@/store";

const resumeConfig: ResumeConfig = {
  title: "前端工程师",
  groupConfig: [
    {
      subtitle: "教育背景",
      contents: [
        {
          contentTitle: "成都信息工程大学",
          timeRange: {
            start: "2020.09",
            end: "2024.6",
          },
          detail: "成信大读书",
        },
      ],
    },
    {
      subtitle: "实习经验",
      contents: [
        {
          contentTitle: "成都美团软件技术有限公司 | 餐饮 SaaS",
          timeRange: {
            start: "2023.04.10",
            end: "2023.08.25",
          },
          description: "前端开发实习生",
          detail: [
            "参与项目部分模块数据管理方案重构，使用开源库 mobx-state-tree 替代 mobx 规范开发流程，独立设计并实现 fetchModel 请求通用模型，为请求常见的 防抖、轮询、异步竞态、数据缓存、错误校验 等问题提供了标准解决方案。",
            "参与日常需求开发，有 Web、App、小程序 三端需求开发经验，独立设计并完成多个中型需求，封装、改良数个全域公用组件，开发 日均 bug 率 0.2。",
            "主R某业务域的日常维护，处理线上工单，为用户提供线上排错并负责 bug 修复，对工作中业务侧场景有一定处理经验。",
          ],
        },
      ],
    },
    {
      subtitle: "项目经历",
      contents: [
        {
          contentTitle: "molix-ui",
          tags: ["Vue3", "Ts", "pnpm", "Monorepo", "SCSS"],
          detail: [
            "负责项目基础结构搭建 , 使用 pnpm + Monorepo 项目依赖管理方式降低项目依赖管理成本。样式预处理选择 SCSS 结合 Bem 规范 , 提升项目样式规范性和开发效率。",
            "组件内部实现通用逻辑，预留 插槽、实例方法 提升组件可拓展、可自定义性。",
            "针对开发需求，封装了如 DOM操作、CSS预处理、类型断言 等一系列工具。",
            "各组件均有基于 Vitest 编写的单元测试，确保打包后的项目能够正常运行。",
          ],
          description: [
            "该项目是一个基于 Vue3 的业务组件库，旨在提高项目代码复用率及 UI 样式规范性。",
            "GitHub项目地址：https://github.com/molix-ui/Molix",
          ],
        },
      ],
    },
  ],
  personalInfo: {
    leftPart: [
      {
        icon: "mian-renwu",
        content: "高歌/男/2001.10",
      },
      {
        icon: "weixin",
        content: "gaoge949699002",
      },
    ],

    rightPart: [
      {
        icon: "fangzi",
        content: "www.linxae.com",
        clickAble: true,
      },
      {
        icon: "github",
        content: "https://github.com/Linxae030",
        clickAble: true,
      },
    ],
  },
};

const Edit = observer(() => {
  const { resumeStore } = useStore();
  const { currentResumeData, setCurrentId, treeData } = resumeStore;

  return (
    <div className="resume-edit-container">
      <div className="config-form-container">
        <ConfigFormTree treeData={treeData} />
      </div>
      <div className="previewer-container">
        <ResumePreviewer
          resumeConfig={currentResumeData?.resumeConfig}
        ></ResumePreviewer>
      </div>
    </div>
  );
});

export default Edit;
