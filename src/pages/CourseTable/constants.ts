import { WeekCourses, WeekCoursesInfo } from "@/apis/courseTable/types";

export const WEEK_TABLE: {
  title: string;
  dataIndex: keyof WeekCourses;
}[] = [
  {
    title: "周一",
    dataIndex: "mondayCourses",
  },
  {
    title: "周二",
    dataIndex: "tuesdayCourses",
  },
  {
    title: "周三",
    dataIndex: "wednesdayCourses",
  },
  {
    title: "周四",
    dataIndex: "thursdayCourses",
  },
  {
    title: "周五",
    dataIndex: "fridayCourses",
  },
  {
    title: "周六",
    dataIndex: "saturdayCourses",
  },
  {
    title: "周日",
    dataIndex: "sundayCourses",
  },
];

/** 表头高度 */
export const FORM_HEADER_HEIGHT = 61;
/** 基础时间便宜 */
export const BASE_TIME_OFFSET = 290;
/** 秒每分钟 */
export const SECOND_PER_MINUTE = 60;
/** 小时基数 */
export const BASE_HOUR = 5;
