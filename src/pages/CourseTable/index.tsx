import React from "react";
import SchedulingTable from "./SchedulingTable";
import useStore from "@/store";

const CourseTable = () => {
  const { courseTableStore } = useStore();
  const { courseInfo } = courseTableStore;

  return (
    <div>
      <SchedulingTable courseInfo={courseInfo}></SchedulingTable>
    </div>
  );
};

export default CourseTable;
