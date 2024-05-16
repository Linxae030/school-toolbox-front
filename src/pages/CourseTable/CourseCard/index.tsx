import React from "react";
import "./index.less";
import { Button, Checkbox, Form, Input, Popconfirm, TimePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { observer } from "mobx-react-lite";
import { Course } from "@/apis/courseTable/types";
import { useFormModal } from "@/components/Modal";
import RangeInput from "@/components/RangeInput";

interface IProps {
  course: Course;
  // index: number;
  onEdit: (curCourse: Course, courseId: string) => void;
  onDelete: (courseId: string) => void;
}

type CourseFormType = Course & { time: [Dayjs, Dayjs] };

const CourseCard: React.FC<IProps> = observer((props) => {
  const { course, onEdit, onDelete } = props;
  const { start, end, classroom, courseName, teacher, day, weekRange, _id } =
    course;
  console.log("weekRange", weekRange);
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
    onEdit(
      {
        ...rest,
        start: [time[0].hour(), time[0].minute()],
        end: [time[1].hour(), time[1].minute()],
        day,
      },
      course._id,
    );
  };

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
              required: true,
              message: "请选择课程周数",
            },
          ]}
        >
          <RangeInput />
        </Form.Item>
        <Form.Item label="操作">
          <Popconfirm
            title="删除课程"
            description="确定删除该课程吗？"
            onConfirm={() => onDelete(_id)}
            okText="是"
            cancelText="否"
          >
            <Button danger type="primary">
              删除
            </Button>
          </Popconfirm>
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
        weekRange,
      },
    });
  };

  return (
    <div
      className="course-card"
      style={{
        top: `${getOffsetTop(start)}px`,
        height: `${getHeightRatio(start, end)}px`,
      }}
      onMouseMove={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="course-content" onClick={handleClick}>
        <div>
          <div>{courseName}</div>
          <div>{teacher}</div>
          <div>{classroom}</div>
          <div>{`${weekRange[0]}周 - ${weekRange[1]}周`}</div>
        </div>
        <div>
          {`${fixNumber(course.start[0])}:${fixNumber(
            course.start[1],
          )} - ${fixNumber(course.end[0])}:${fixNumber(course.end[1])}`}
        </div>
      </div>
    </div>
  );
});

export default CourseCard;
