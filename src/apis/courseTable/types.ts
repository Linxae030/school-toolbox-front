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

export interface Course {
  courseName: string;
  day: DayOfWeekEnum;
  classroom: string;
  teacher?: string;
  start: [number, number];
  end: [number, number];
}

export interface CourseInfo extends MongooseDoc {
  mondayCourses?: Course[];
  tuesdayCourses?: Course[];
  wednesdayCourses?: Course[];
  thursdayCourses?: Course[];
  fridayCourses?: Course[];
  saturdayCourses?: Course[];
  sundayCourses?: Course[];
}
