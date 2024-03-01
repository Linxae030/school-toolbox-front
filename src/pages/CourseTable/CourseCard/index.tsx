import React from "react";
import "./index.less";
import { Checkbox, Form, Input, TimePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Course } from "@/apis/courseTable/types";
import { useFormModal } from "@/components/Modal";

interface IProps {
  course: Course;
  // index: number;
  onEdit: (curCourse: Course) => void;
  // removeCourse: (index: number) => void;
}

type CourseFormType = Course & { time: [Dayjs, Dayjs] };

const CourseCard: React.FC<IProps> = (props) => {
  const { course, onEdit } = props;
  const { start, end, classroom, courseName, teacher, day } = course;
  const format = "HH:mm";
  const formModalHandler = useFormModal();

  const getOffsetTop = (start: [number, number]) => {
    const startHour = start[0];
    const startMinute = start[1];
    return (startHour - 6) * 60 + startMinute;
  };

  const getHeightRatio = (
    start: [number, number],
    end: [number, number],
  ): number => {
    const startHour = start[0];
    const startMinute = start[1];
    const endHour = end[0];
    const endMinute = end[1];
    return (endHour - startHour) * 60 + (endMinute - startMinute);
  };

  const fixNumber = (num: number): string => {
    const str = String(num);
    return str.length > 1 ? str : `0${str}`;
  };

  const formatTime = (time: [number, number]) => {
    return dayjs(`${fixNumber(time[0])}:${fixNumber(time[1])}`, format);
  };

  const handleEdit = (value: CourseFormType) => {
    const { time, ...rest } = value;
    onEdit({
      ...rest,
      start: [time[0].hour(), time[0].minute()],
      end: [time[1].hour(), time[1].minute()],
      day,
    });
  };

  const renderEditCourseForm = () => {
    return (
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 12 }}
        style={{ maxWidth: 600 }}
      >
        <Form.Item label="课程名" name="courseName">
          <Input />
        </Form.Item>
        <Form.Item label="教师" name="teacher">
          <Input />
        </Form.Item>
        <Form.Item label="教室" name="classroom">
          <Input />
        </Form.Item>
        <Form.Item label="时间" name="time">
          <TimePicker.RangePicker
            format={format}
            disabledTime={() => ({
              disabledHours: () => [0, 1, 2, 3, 4, 5, 23],
            })}
            placeholder={["开始时间", "结束时间"]}
          />
        </Form.Item>
      </Form>
    );
  };
  const handleClick = () => {
    formModalHandler.open<CourseFormType>({
      modalProps: {
        title: "编辑课程",
        okText: "保存",
        cancelText: "取消",
        onOk: handleEdit,
      },
      formChildren: renderEditCourseForm(),
      initialValue: {
        courseName,
        teacher,
        classroom,
        time: [formatTime(start), formatTime(end)],
      },
    });
  };

  return (
    <div
      className="course-content"
      style={{
        top: `${getOffsetTop(start)}px`,
        height: `${getHeightRatio(start, end)}px`,
      }}
      onClick={handleClick}
    >
      <div>
        <div>{courseName}</div>
        <div>{teacher}</div>
        <div>{classroom}</div>
      </div>
      <div>
        {`${fixNumber(course.start[0])}:${fixNumber(
          course.start[1],
        )} - ${fixNumber(course.end[0])}:${fixNumber(course.end[1])}`}
      </div>
    </div>
  );
};

export default CourseCard;
