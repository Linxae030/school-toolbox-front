import { makeAutoObservable, runInAction, toJS } from "mobx";
import * as _ from "lodash";
import { message } from "antd";
import {
  Course,
  CourseInfo,
  CreateLinkPayload,
  UpdateCoursePayload,
  UpdateWeekPayload,
  WeekCourses,
  WeekCoursesInfo,
} from "@/apis/courseTable/types";
import {
  createCourse,
  findAllCourses,
  updateCourse,
  updateWeek,
} from "@/apis/courseTable";
import { handleResponse } from "@/utils";
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
      (res) => {
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
      (res) => {
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
      (res) => {
        message.success(res.msg);
      },
      (res) => {
        const { ret } = res;

        message.error(ret);
      },
    );
  };

  deleteCourseOpr = async (week: keyof WeekCoursesInfo, id: string) => {
    const res = await deleteCourse({ week, id });
    handleResponse(
      res,
      (res) => {
        message.success(res.msg);
      },
      (res) => {
        const { ret } = res;
        message.error(ret);
      },
    );
  };

  updateCourseOpr = async (payload: UpdateCoursePayload) => {
    const res = await updateCourse(payload);
    handleResponse(
      res,
      (res) => {
        message.success(res.msg);
      },
      (res) => {
        const { ret } = res;
        message.error(ret);
      },
    );
  };

  updateWeekOpr = async (payload: UpdateWeekPayload) => {
    const res = await updateWeek(payload);
    handleResponse(
      res,
      (res) => {
        message.success(res.msg);
      },
      (res) => {
        const { ret } = res;
        message.error(ret);
      },
    );
  };
}
