import { Course } from "@/apis/courseTable/types";
import { SECOND_PER_MINUTE, BASE_HOUR } from "./constants";

/**
 * @description 把时间偏移量转换为时间字符串
 * @param offset
 * @returns {string}
 * @example convertTimeOffsetToTimeString(0) => "08:00"
 */
export const convertTimeOffsetToTimeString = (offset: number) => {
  const baseHour = `${
    Math.floor(offset / SECOND_PER_MINUTE) + BASE_HOUR
  }`.padStart(2, "0");
  const baseMinute = `${Math.floor(offset % SECOND_PER_MINUTE)}`.padStart(
    2,
    "0",
  );
  return `${baseHour}:${baseMinute}`;
};

/**
 * @description 检查是否有时间冲突
 * @param newCourse 待检查课程
 * @param courses 课程列表
 * @returns {boolean}
 */
export const checkTimeConflict = (newCourse: Course, courses: Course[]) => {
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

export const convertTimeArrToString = (timeArray: number[]) => {
  const hour = `${timeArray[0]}`.padStart(2, "0");
  const minute = `${timeArray[1]}`.padStart(2, "0");
  return `${hour}:${minute}`;
};
