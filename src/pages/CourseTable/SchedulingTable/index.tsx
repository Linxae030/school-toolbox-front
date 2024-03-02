import React, { useState } from "react";
import "./index.less";

import { Table, TableProps } from "antd";
import CourseCard from "../CourseCard";
import { Course, CourseInfo } from "@/apis/courseTable/types";
import { WEEK_TABLE } from "../constants";
import { convertToTime } from "@/utils";
import { mapRender } from "../../../utils/utils";

interface IProps {
  courseInfo: CourseInfo;
}

type DataType = {
  key: string;
  timeEdge: number;
  timeDisplay: string;
} & CourseInfo;

const SchedulingTable: React.FC<IProps> = ({ courseInfo }) => {
  const [timeLineOffsetTop, setTimeLineOffsetTop] = useState(0);
  const [timeLineDisplay, setTimeLineDisplay] = useState(true);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { top } = (e.target as HTMLElement).getBoundingClientRect();
    // +60 是因为表头占了60px
    setTimeLineOffsetTop(e.clientY - top + 60);
    setTimeLineDisplay(true);
  };

  const convertToTimeString = (value: number) => {
    const baseHour = `${Math.floor(value / 60) + 5}`.padStart(2, "0");
    const baseMinute = `${Math.floor(value % 60)}`.padStart(2, "0");
    return `${baseHour}:${baseMinute}`;
  };

  const resetTimeLine = () => {
    setTimeLineDisplay(false);
    setTimeLineOffsetTop(60);
  };

  const dayTimeArray = Array.from({ length: 17 }, (_, index) => index + 6);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "",
      dataIndex: "timeDisplay",
      rowScope: "row",
      width: 50,
      align: "center",
      className: "time-row",
      onCell: () => ({
        onMouseMove: (e) => e.stopPropagation(),
        onMouseEnter: resetTimeLine,
      }),
    },
    ...(WEEK_TABLE.map(({ title, dataIndex }) => ({
      title,
      align: "center",
      rowScope: "row",
      dataIndex,
      render: (record: Course) => (
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
      ),
      onCell: (_: any, index: number) => ({
        rowSpan: index === 0 ? 17 : 0,
        onClick: (e: any) => {
          console.log(" 6", e);
        },
      }),
    })) as any[]),
  ];

  const dataSource: DataType[] = dayTimeArray.map((number, index) => ({
    key: `${index}`,
    timeEdge: number,
    timeDisplay: convertToTime(number),
    ...courseInfo,
  }));

  return (
    <div
      className="scheduling-table"
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTimeLine}
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        bordered
        pagination={false}
        onRow={() => ({
          onMouseLeave: resetTimeLine,
        })}
        onHeaderRow={() => ({
          onMouseMove: (e) => e.stopPropagation(),
        })}
      />
      <div
        className="time-line"
        style={{
          top: timeLineOffsetTop,
          display: timeLineDisplay ? "block" : "none",
        }}
      >
        <span className="time">{convertToTimeString(timeLineOffsetTop)}</span>
      </div>
    </div>
  );
};

export default SchedulingTable;
