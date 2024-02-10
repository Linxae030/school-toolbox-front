/**
 * @component 简历预览展示组件
 */
import { HTMLProps } from "react";
import "./index.less";

import * as cx from "classnames";
import { Resume } from "@/apis/resume";
import { ensureArray, iconfontCx, mapRender } from "@/utils";
import GroupBlock from "./GroupBlock";

type IProps = Pick<Resume, "resumeConfig"> & {
  previewMode?: boolean;
  _id: string
} & HTMLProps<any>;
const ResumePreviewer = (props: IProps) => {  
  const { resumeConfig,_id, ...rest } = props;
  const { personalInfo, title, groupConfig } = resumeConfig;
  const { leftPart, rightPart } = personalInfo;
  const layoutConfig = [
    { className: "left-part", partItem: leftPart },
    { className: "right-part", partItem: rightPart },
  ]
  return (
    <div
      {...rest}
      id={_id}
      className={cx("resume-previewer")}
    >
      <div className="title block-content">{title}</div>
      <div className="personal-info block-content">
        {mapRender(layoutConfig, (item) => {
          const { className, partItem } = item;
          return (
            <div className={className} key={className}>
              {ensureArray(partItem).map((item) => {
                const { content, icon } = item;
                return (
                  <div className="part-item" key={content}>
                    <span className={`${iconfontCx(icon)} icon`}></span>
                    <span className="content">{content}</span>
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
