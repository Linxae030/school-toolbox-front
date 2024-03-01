import React, { useState, useEffect } from "react";
import "./index.less";

import { Table, TableProps } from "antd";
import { render } from "react-dom";
import { parseInt } from "lodash";
import CourseCard from "../CourseCard";
import { Course, CourseInfo } from "@/apis/courseTable/types";
import { WEEK_TABLE } from "../constants";
import { convertToTime } from "@/utils";
import { mapRender } from "../../../utils/utils";

interface IProps {
  courseInfo: CourseInfo;
  // minuteHeight: number;
  // showTimeline: boolean;
  // stickyTop: number;
  // onAdd: (part: any) => void;
  // onEdit: (index: number, course: any) => void;
  // onRemove: (index: number, course: any) => void;
}
interface DataType {
  key: string;
  timeEdge: number;
  timeDisplay: string;
}

// In the fifth row, other columns are merged into first column
// by setting it's colSpan to be 0
const sharedOnCell = (_: DataType, index: number) => {
  if (index === 1) {
    return { colSpan: 0 };
  }

  return {};
};

const SchedulingTable: React.FC<IProps> = (props) => {
  const [timeLineOffsetTop, setTimeLineOffsetTop] = useState(0);
  const { courseInfo } = props;
  const {
    mondayCourses,
    tuesdayCourses,
    wednesdayCourses,
    thursdayCourses,
    fridayCourses,
    saturdayCourses,
    sundayCourses,
  } = courseInfo;
  /** 构造6-24 */
  const dayTimeArray = Array.from({ length: 17 }, (_, index) => index + 6);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "",
      dataIndex: "timeDisplay",
      rowScope: "row",
      width: 50,
      align: "center",
      className: "time-row",
      onCell: () => {
        return {
          onMouseMove: (e) => e.stopPropagation(),
          onMouseEnter: () => setTimeLineOffsetTop(60),
        };
      },
    },
    ...(WEEK_TABLE.map(({ title, dataIndex }) => ({
      title,
      align: "center",
      rowScope: "row",
      dataIndex,
      render: (record: Course, row: any, index: number) => {
        return (
          <>
            {mapRender(record, (course) => (
              <CourseCard
                course={course}
                key={course.courseName}
                onEdit={(course) => {
                  console.log(course);
                }}
              ></CourseCard>
            ))}
          </>
        );
      },
      onCell: (_: any, index: number) => {
        let rowSpan = 0;
        if (index === 0) {
          rowSpan = 17;
        }

        if (index >= 1 && index <= 16) {
          return {
            rowSpan: 0,
          };
        }
        return {
          rowSpan,
          onClick: (e: any) => {
            console.log(" 6", e);
          },
        };
      },
    })) as any[]),
  ];

  const dataSource: DataType[] = dayTimeArray.map((number, index) => ({
    key: `${index}`,
    timeEdge: number,
    timeDisplay: convertToTime(number),
    mondayCourses,
    tuesdayCourses,
    wednesdayCourses,
    thursdayCourses,
    fridayCourses,
    saturdayCourses,
    sundayCourses,
  }));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const element = e.target; // 获取目标元素
    const { top } = element.getBoundingClientRect(); // 获取元素相对于视口的位置信息
    const mouseY = e.clientY; // 获取鼠标在视口中的垂直位置

    const relativeHeight = mouseY - top; // 计算鼠标相对于元素顶部的高度
    // if (e.target.className === "ant-table-cell ant-table-cell-row-hover") {
    if (relativeHeight > 0) setTimeLineOffsetTop(relativeHeight + 60);
    //   console.log(e);
    // }
  };
  function convertToTimeString(value: number) {
    const baseHour = `${Math.floor(value / 60) + 5}`;
    const baseMinute = `${Math.floor(value % 60)}`;
    const minute = baseMinute[1] ? baseMinute : `0${baseMinute}`;
    const hour = baseHour[1] ? baseHour : `0${baseHour}`;
    console.log(value, baseHour);
    return `${hour}:${minute}`;
  }
  return (
    <div
      className="scheduling-table"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTimeLineOffsetTop(60)}
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        bordered
        pagination={false}
        onRow={() => ({
          onMouseLeave: () => setTimeLineOffsetTop(60),
        })}
        onHeaderRow={() => ({
          onMouseMove: (e) => e.stopPropagation(),
        })}
      />
      <div
        className="time-line"
        style={{
          top: timeLineOffsetTop,
        }}
      >
        <span className="time">{convertToTimeString(timeLineOffsetTop)}</span>
      </div>
    </div>
  );
};

export default SchedulingTable;
