import { makeAutoObservable } from "mobx";
import { Course, CourseInfo, WeekCourses } from "@/apis/courseTable/types";
import * as _ from "lodash";

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
        weekRange:[1, 18]
      },
    ],
    tuesdayCourses: [],
    wednesdayCourses: [],
    thursdayCourses: [],
    fridayCourses: [
      {
        courseName: "早读",
        classroom:"H4304",
        teacher:"胡道海",
        day: 3,
        start: [11, 30],
        end: [12, 45],
        weekRange:[1, 18]
      },
      {
        courseName: "早读",
        classroom:"H4304",
        teacher:"胡道海",
        day: 3,
        start: [10, 30],
        end: [11, 45],
        weekRange:[1, 18]
      },
    ],
    saturdayCourses: [],
    sundayCourses: [],
  };

  constructor(){
    makeAutoObservable(this);
  }

  pushCourse = (path: keyof WeekCourses, value: Course)=> {
    this.courseInfo[path]?.push(value);
  }
}
