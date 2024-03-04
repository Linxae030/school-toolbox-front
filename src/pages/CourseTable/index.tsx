import React from "react";
import SchedulingTable from "./SchedulingTable";
import useStore from "@/store";
import { Course, WeekCourses } from "@/apis/courseTable/types";

const CourseTable = () => {
  const { courseTableStore } = useStore();
  const { courseInfo, pushCourse } = courseTableStore;

  const handleCreate = (course: Course, dataIndex: keyof WeekCourses) => {
    pushCourse(dataIndex, course);
  };

  return (
    <div>
      <SchedulingTable
        courseInfo={courseInfo}
        store={courseTableStore}
        handleCreate={handleCreate}
      ></SchedulingTable>
    </div>
  );
};

export default CourseTable;
