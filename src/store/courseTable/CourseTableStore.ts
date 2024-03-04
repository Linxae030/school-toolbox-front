import { makeAutoObservable, runInAction, toJS } from "mobx";
import { Course, CourseInfo, CreateLinkPayload, WeekCourses } from "@/apis/courseTable/types";
import * as _ from "lodash";
import { createCourse, findAllCourses, updateCourse } from "@/apis/courseTable";
import { handleResponse } from "@/utils";
import { message } from "antd";
import { deleteCourse } from "../../apis/courseTable/index";

export default class CourseTableStore {
  courseInfo: CourseInfo = {} as unknown as CourseInfo;

  constructor() {
    makeAutoObservable(this);
  }

  pushCourse = (path: keyof WeekCourses, value: Course) => {
    this.courseInfo[path]?.push(value);
  };

  findAllCourseOpr = async () => {
    const res = await findAllCourses();
    handleResponse(
      res,
      res => {
        runInAction(() => {
          const { data } = res;
          this.courseInfo = data ?? {
            mondayCourses: [],
            tuesdayCourses: [],
            wednesdayCourses: [],
            thursdayCourses: [],
            fridayCourses: [],
            saturdayCourses: [],
            sundayCourses: [],
          };
        });
      },
      res => {
        const { ret } = res;
        message.error(ret);
      },
    );
  };

  createCourseOpr = async () => {
    const { _id, createdAt, updatedAt, ...rest } = toJS(this.courseInfo);
    const res = await createCourse(rest);
    handleResponse(
      res,
      res => {
        message.success(res.msg);
      },
      res => {
        const { ret } = res;

        message.error(ret);
      },
    );
  };

  deleteCourseOpr = async (week: keyof WeekCourses, id: string) => {
    const res = await deleteCourse({ week, id });
    handleResponse(
      res,
      res => {
        message.success(res.msg);
      },
      res => {
        const { ret } = res;
        message.error(ret);
      },
    );
  };

  updateCourseOpr = async (payload: { week: keyof WeekCourses; id: string; course: Course }) => {
    const res = await updateCourse(payload);
    handleResponse(
      res,
      res => {
        message.success(res.msg);
      },
      res => {
        const { ret } = res;
        message.error(ret);
      },
    );
  }
}
