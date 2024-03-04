import "./index.less";
import React, { useState } from "react";
import { Form, Input, Table, TableProps, TimePicker, message } from "antd";

import dayjs, { Dayjs } from "dayjs";
import CourseCard from "../CourseCard";

import {
  BASE_HOUR,
  BASE_TIME_OFFSET,
  FORM_HEADER_HEIGHT,
  SECOND_PER_MINUTE,
  WEEK_TABLE,
} from "../constants";

import type { Course, CourseInfo, WeekCourses } from "@/apis/courseTable/types";
import { convertToTime, ensureArray, mapRender } from "@/utils";
import { useFormModal } from "@/components/Modal";
import CourseTableStore from "@/store/courseTable/CourseTableStore";
import RangeInput from "@/components/RangeInput";
import { convertTimeOffsetToTimeString } from "../utils";

interface IProps {
  courseInfo: CourseInfo;
  handleCreate: (course: Course, dataIndex: keyof WeekCourses) => void;
  store: CourseTableStore;
}
type CourseFormType = Course & { time: [Dayjs, Dayjs] };

type DataType = {
  key: string;
  timeEdge: number;
  timeDisplay: string;
} & CourseInfo;

const SchedulingTable: React.FC<IProps> = ({ courseInfo, handleCreate }) => {
  const [timeLineOffsetTop, setTimeLineOffsetTop] = useState(0);
  const [timeLineDisplay, setTimeLineDisplay] = useState(true);
  const [timeOffsetLeft, setTimeOffsetLeft] = useState(0);
  const formModalHandler = useFormModal();

  const format = "HH:mm";

  const renderEditCourseForm = () => {
    return (
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 12 }}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="课程名"
          name="courseName"
          rules={[
            {
              required: true,
              message: "请输入课程名",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="教师"
          name="teacher"
          rules={[
            {
              required: true,
              message: "请输入教师名",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="教室"
          name="classroom"
          rules={[
            {
              required: true,
              message: "请输入教室",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="时间"
          name="time"
          rules={[
            {
              required: true,
              message: "请选择课程时间",
            },
          ]}
        >
          <TimePicker.RangePicker
            format={format}
            disabledTime={() => ({
              disabledHours: () => [0, 1, 2, 3, 4, 5, 23],
            })}
            placeholder={["开始时间", "结束时间"]}
          />
        </Form.Item>
        <Form.Item
          label="周数"
          name="weekRange"
          rules={[
            {
              validator(rule, value: number[], callback) {
                if (value[0] > value[1]) {
                  return Promise.reject(new Error("结束周数不能小于开始周数"));
                }
                if (value.some((item) => !item)) {
                  return Promise.reject(new Error("周数异常"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <RangeInput />
        </Form.Item>
      </Form>
    );
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { top, left } = (e.target as HTMLElement).getBoundingClientRect();
    // +61 是因为表头占了61px
    setTimeLineOffsetTop(e.clientY - top + FORM_HEADER_HEIGHT);
    setTimeOffsetLeft(left - BASE_TIME_OFFSET);
    setTimeLineDisplay(true);
  };

  const resetTimeLine = () => {
    setTimeLineDisplay(false);
    setTimeLineOffsetTop(60);
  };

  const checkTimeConflict = (newCourse: Course, courses: Course[]) => {
    for (let i = 0; i < courses.length; i += 1) {
      const existingObject = courses[i];
      const start1 = newCourse.start;
      const end1 = newCourse.end;
      const start2 = existingObject.start;
      const end2 = existingObject.end;

      if (start1[0] < end2[0] && end1[0] > start2[0]) {
        // 时间段重叠，存在冲突
        return true;
      }
      if (start1[0] === end2[0] && start1[1] < end2[1]) {
        // 时间段边界重叠，存在冲突
        return true;
      }
      if (end1[0] === start2[0] && end1[1] > start2[1]) {
        // 时间段边界重叠，存在冲突
        return true;
      }
    }

    // 没有冲突
    return false;
  };

  const handleCellClick = (dataIndex: keyof WeekCourses) => {
    const selectedTime = dayjs(
      convertTimeOffsetToTimeString(timeLineOffsetTop),
      format,
    );
    console.log("timeLineOffsetTop", selectedTime);
    formModalHandler.open<CourseFormType>({
      modalProps: {
        title: "创建课程",
        okText: "创建",
        cancelText: "取消",
        onOk: ({ time, ...rest }) => {
          const newCourse = {
            ...rest,
            start: [time[0].hour(), time[0].minute()] as [number, number],
            end: [time[1].hour(), time[1].minute()] as [number, number],
            day: WEEK_TABLE.findIndex(
              (item) => item.dataIndex === dataIndex,
            ) as number,
          };
          const res = checkTimeConflict(
            newCourse,
            ensureArray(courseInfo[dataIndex]),
          );
          if (res) {
            message.error("课程时间存在冲突, 请重新选择时间");
          } else {
            handleCreate(newCourse, dataIndex);
          }
        },
      },
      formChildren: renderEditCourseForm(),
      initialValue: {
        time: [selectedTime, selectedTime.add(1, "minute")],
      },
    });
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
              key={course.courseName + Math.random()}
              onEdit={(course) => {
                console.log(course);
              }}
              onDelete={(courseId) => {
                console.log(courseId);
              }}
              // onMouseEnter={resetTimeLine}
            ></CourseCard>
          ))}
        </>
      ),
      onCell: (_: any, index: number) => ({
        rowSpan: index === 0 ? 17 : 0,
        onClick: (e: any) => {
          handleCellClick(dataIndex);
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
        <span
          className="time"
          style={{
            left: timeOffsetLeft,
          }}
        >
          {convertTimeOffsetToTimeString(timeLineOffsetTop)}
        </span>
      </div>
    </div>
  );
};

export default SchedulingTable;
