import React from "react";
import "./index.less";

import { Resume } from "@/apis/resume";
import { ensureArray, mapRender } from "@/utils";
import GroupBlock from "./GroupBlock";

type IProps = Pick<Resume, "resumeConfig">;
const ResumePreviewer = (props: IProps) => {
  const { resumeConfig } = props;
  const { personalInfo, title, groupConfig } = resumeConfig;
  const { leftPart, rightPart } = personalInfo;
  return (
    <div className="resume-previewer">
      <div className="title block-content">{title}</div>
      <div className="personal-info block-content">
        {[
          { className: "left-part", partItem: leftPart },
          { className: "right-part", partItem: rightPart },
        ].map((item) => {
          const { className, partItem } = item;
          return (
            <div className={className} key={className}>
              {ensureArray(partItem).map((item) => {
                const { content, icon, clickAble } = item;
                return (
                  <div className="part-item" key={content}>
                    <span className={`iconfont icon-${icon} icon`}></span>
                    {clickAble ? (
                      <a className="content" href={content} target="_blank">
                        {content}
                      </a>
                    ) : (
                      <span className="content">{content}</span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="group">
        {mapRender(groupConfig, (item) => (
          <GroupBlock key={item.subtitle} {...item} />
        ))}
      </div>
    </div>
  );
};

export default ResumePreviewer;
