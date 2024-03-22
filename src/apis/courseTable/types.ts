import { MongooseDoc } from "@/types";

export enum DayOfWeekEnum {
  Monday = 0,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

export interface Course extends MongooseDoc {
  courseName: string;
  day: DayOfWeekEnum;
  classroom: string;
  start: [number, number];
  end: [number, number];
  teacher: string;
  weekRange: [number, number];
}

export interface WeekCoursesInfo {
  currentWeek: string;
  mondayCourses?: Course[];
  tuesdayCourses?: Course[];
  wednesdayCourses?: Course[];
  thursdayCourses?: Course[];
  fridayCourses?: Course[];
  saturdayCourses?: Course[];
  sundayCourses?: Course[];
}

export type WeekCourses = Omit<WeekCoursesInfo, "currentWeek">;

export type CourseInfo = WeekCoursesInfo & MongooseDoc;

export type CreateLinkPayload = WeekCoursesInfo;
export type DeleteCoursePayload = {
  week: keyof WeekCoursesInfo;
  id: string;
};
export type UpdateCoursePayload = {
  week: keyof WeekCoursesInfo;
  id: string;
  course: Course;
};

export type UpdateWeekPayload = {
  week: number;
};

export type FindAllCourseRes = CourseInfo;
