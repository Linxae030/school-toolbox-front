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

export interface WeekCourses {
  mondayCourses?: Course[];
  tuesdayCourses?: Course[];
  wednesdayCourses?: Course[];
  thursdayCourses?: Course[];
  fridayCourses?: Course[];
  saturdayCourses?: Course[];
  sundayCourses?: Course[];
}

export type CourseInfo = WeekCourses & MongooseDoc;

export type CreateLinkPayload = WeekCourses;
export type DeleteCoursePayload = {
  week: keyof WeekCourses;
  id: string;
};
export type UpdateCoursePayload = {
  week: keyof WeekCourses;
  id: string;
  course: Course;
};

export type FindAllCourseRes = CourseInfo;
