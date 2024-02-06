import { memo } from "react";
import "./index.less";
import * as _ from "lodash";
import { GroupConfig, GroupDesc, GroupDetail, TimeRange } from "@/apis/resume";
import { conditionalRender, mapRender } from "@/utils";

type IProps = GroupConfig;
const GroupBlock = memo((props: IProps) => {
  const { subtitle, contents } = props;

  const formatTimeRange = (timeRange: TimeRange) => {
    const { start, end } = timeRange;
    return `${start} - ${end}`;
  };

  const renderTimeRange = (timeRange?: TimeRange) => {
    return conditionalRender(timeRange, () => (
      <span>{formatTimeRange(timeRange!)}</span>
    ));
  };

  const renderTags = (tags?: string[]) => {
    return conditionalRender(tags, () => (
      <div className="tag-container">
        {mapRender(tags, (tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    ));
  };

  const renderDesc = (desc?: GroupDesc) => {
    return conditionalRender(
      _.isArray(desc),
      () => (
        <div className="description">
          {mapRender(desc, (desc) => (
            <span key={desc}>{desc}</span>
          ))}
        </div>
      ),
      () => desc,
    );
  };

  const renderDetail = (detail: GroupDetail) => {
    return conditionalRender(
      _.isArray(detail),
      () => (
        <ul>
          {mapRender(detail, (item) => (
            <li className="list-item" key={item}>
              {item}
            </li>
          ))}
        </ul>
      ),
      () => detail,
    );
  };

  return (
    <div className="group-container block-content">
      <div className="sub-title">{subtitle}</div>
      {mapRender(contents, (content) => {
        const { contentTitle, tags, timeRange, detail, description } = content;
        return (
          <div className="group-item-content" key={contentTitle}>
            <div className="content-title">
              {/* title */}
              <span>{contentTitle}</span>
              {/* timeRange */}
              {renderTimeRange(timeRange)}
            </div>
            {/* tag */}
            {renderTags(tags)}
            {/* description */}
            {renderDesc(description)}
            {/* detail */}
            {renderDetail(detail)}
          </div>
        );
      })}
    </div>
  );
});

export default GroupBlock;
