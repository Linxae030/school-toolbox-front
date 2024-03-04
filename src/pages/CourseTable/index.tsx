import "./index.less";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { InputNumber, Select, message } from "antd";
import SchedulingTable from "./SchedulingTable";
import useStore from "@/store";
import { Course, WeekCourses } from "@/apis/courseTable/types";
import { ensureArray, waitAndRefreshPage } from "@/utils";
import { checkTimeConflict } from "./utils";

const CourseTable = observer(() => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const { courseTableStore } = useStore();
  const navigate = useNavigate();
  const {
    courseInfo,
    pushCourse,
    createCourseOpr,
    findAllCourseOpr,
    deleteCourseOpr,
    updateCourseOpr,
  } = courseTableStore;

  const handleCreate = async (course: Course, dataIndex: keyof WeekCourses) => {
    pushCourse(dataIndex, course);
    await createCourseOpr();
    waitAndRefreshPage(navigate, 0.5);
  };

  const handleDelete = async (
    courseId: string,
    dataIndex: keyof WeekCourses,
  ) => {
    await deleteCourseOpr(dataIndex, courseId);
    waitAndRefreshPage(navigate, 0.5);
  };

  const handleEdit = async (
    courseId: string,
    course: Course,
    dataIndex: keyof WeekCourses,
  ) => {
    const res = checkTimeConflict(course, ensureArray(courseInfo[dataIndex]));
    if (res) {
      message.error("课程时间存在冲突, 请重新选择时间");
    } else {
      await updateCourseOpr({ week: dataIndex, id: courseId, course });
      waitAndRefreshPage(navigate, 0.5);
    }
  };

  const getWeekOptions = () => {
    const weekOptions = [
      {
        value: 0,
        label: "全部",
      },
    ];
    for (let i = 1; i <= 20; i += 1) {
      weekOptions.push({ value: i, label: `第${i}周` });
    }
    return weekOptions;
  };

  useEffect(() => {
    findAllCourseOpr();
  }, []);

  return (
    <div className="course-table">
      <header className="header">
        <span>当前周数：</span>
        <Select
          defaultValue={0}
          style={{ width: 120 }}
          onChange={(e) => setCurrentWeek(e)}
          options={getWeekOptions()}
        />
      </header>
      <SchedulingTable
        currentWeek={currentWeek}
        courseInfo={courseInfo}
        store={courseTableStore}
        handleCreate={handleCreate}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      ></SchedulingTable>
    </div>
  );
});

export default CourseTable;
