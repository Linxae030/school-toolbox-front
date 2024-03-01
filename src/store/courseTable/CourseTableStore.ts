import { makeAutoObservable } from "mobx";
import { Course, CourseInfo } from "@/apis/courseTable/types";

export default class CourseTableStore {
  courseInfo: CourseInfo = {
    _id:"1",
    createdAt:"1",
    updatedAt:"1",
    mondayCourses: [
      {
        courseName: "早读",
        classroom:"H4304",
        teacher:"胡道海",
        day: 3,
        start: [11, 30],
        end: [12, 45],
      },
    ],
    tuesdayCourses: [],
    wednesdayCourses: [],
    thursdayCourses: [],
    fridayCourses: [  {
      courseName: "早读",
      classroom:"H4304",
      teacher:"胡道海",
      day: 3,
      start: [23, 30],
      end: [8, 45],
    },],
    saturdayCourses: [],
    sundayCourses: [],
  };

  constructor() {
    makeAutoObservable(this);
  }
}
