import "./index.less";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Form, Select, message, notification } from "antd";
import { EditOutlined, SmileOutlined } from "@ant-design/icons";
import { toJS } from "mobx";
import SchedulingTable from "./SchedulingTable";
import useStore from "@/store";
import { Course, WeekCourses, WeekCoursesInfo } from "@/apis/courseTable/types";
import { ensureArray, waitAndRefreshPage } from "@/utils";
import { checkTimeConflict, convertTimeArrToString } from "./utils";
import { useFormModal } from "@/components/Modal";
import { WEEK_TABLE } from "./constants";

type WeekFieldType = {
  week: number;
};

const CourseTable = observer(() => {
  const { courseTableStore } = useStore();
  const navigate = useNavigate();
  const formModalHandler = useFormModal();

  const {
    courseInfo,
    pushCourse,
    createCourseOpr,
    findAllCourseOpr,
    deleteCourseOpr,
    updateCourseOpr,
    updateWeekOpr,
  } = courseTableStore;

  const { currentWeek = 0 } = courseInfo;

  const [previewWeek, setPreviewWeek] = useState(Number(currentWeek));

  const getWeekOptions = () => {
    const weekOptions = [
      {
        value: 0,
        label: "全部",
      },
    ];
    for (let i = 1; i <= 20; i += 1) {
      weekOptions.push({ value: i, label: `第${i}周` });
    }
    return weekOptions;
  };

  function getAddedAndRemovedCourses() {
    const nextWeek = Number(currentWeek) + 1;
    const tempInfo = toJS(courseInfo);
    const addedCourses: Course[][] = [];
    const removedCourses: Course[][] = [];
    Object.keys(courseInfo)
      .filter((key) => key.endsWith("Courses"))
      .forEach((key, index) => {
        addedCourses[index] = [];
        removedCourses[index] = [];
        const courses = tempInfo[key as keyof WeekCourses] as Course[];
        courses.forEach((course) => {
          const [startWeek, endWeek] = course.weekRange;
          if (startWeek === nextWeek) {
            addedCourses[index]?.push(course);
          }
          if (endWeek === Number(currentWeek)) {
            removedCourses[index]?.push(course);
          }
        });
      });
    return [addedCourses, removedCourses];
  }

  const renderEditWeekFormChildren = () => {
    return (
      <Form>
        <Form.Item label="当前周数" name="week">
          <Select
            key={new Date().getTime()}
            style={{ width: 120 }}
            options={getWeekOptions().slice(1)}
          />
        </Form.Item>
      </Form>
    );
  };

  const renderNextWeekCoursesNotice = () => {
    const [addedCourses, removedCourses] = getAddedAndRemovedCourses();
    const hasAdded = addedCourses.some((arr) => arr.length !== 0);
    const hasRemoved = removedCourses.some((arr) => arr.length !== 0);
    if (!hasAdded && !hasRemoved) return "下周没有课程变动哦~";
    return (
      <div>
        {hasAdded ? (
          <div className="course-block" style={{ marginBottom: 10 }}>
            <span
              style={{
                fontSize: 16,
                color: "rgb(16,142,233)",
              }}
            >
              新增课程：
            </span>
            {addedCourses.map((courses, index) => {
              if (courses.length !== 0)
                return (
                  <div key={index}>
                    <span>
                      <div>{WEEK_TABLE[index].title}：</div>
                      {courses.map((course, _index) => (
                        <div key={course.courseName}>{`${_index + 1}. ${
                          course.courseName
                        }（${convertTimeArrToString(
                          course.start,
                        )} - ${convertTimeArrToString(course.end)}）`}</div>
                      ))}
                    </span>
                  </div>
                );
              return null;
            })}
          </div>
        ) : null}
        {hasRemoved ? (
          <div>
            <span
              style={{
                fontSize: 16,
                color: "rgb(16,142,233)",
              }}
            >
              结束课程：
            </span>
            {removedCourses.map((courses, index) => {
              if (courses.length !== 0)
                return (
                  <div key={index} style={{ marginBottom: 10 }}>
                    <span>
                      <div>{WEEK_TABLE[index].title}：</div>
                      {courses.map((course, _index) => (
                        <div key={course.courseName}>{`${_index + 1}. ${
                          course.courseName
                        }（${convertTimeArrToString(
                          course.start,
                        )} - ${convertTimeArrToString(course.end)}）`}</div>
                      ))}
                    </span>
                  </div>
                );
              return null;
            })}
          </div>
        ) : null}
      </div>
    );
  };

  const handleCreate = async (course: Course, dataIndex: keyof WeekCourses) => {
    pushCourse(dataIndex, course);
    await createCourseOpr();
    await waitAndRefreshPage(navigate, 0.5);
  };

  const handleDelete = async (
    courseId: string,
    dataIndex: keyof WeekCourses,
  ) => {
    await deleteCourseOpr(dataIndex, courseId);
    await waitAndRefreshPage(navigate, 0.5);
  };

  const handleEdit = async (
    courseId: string,
    course: Course,
    dataIndex: keyof WeekCourses,
  ) => {
    const res = checkTimeConflict(
      { ...course, _id: courseId },
      ensureArray(courseInfo[dataIndex]),
    );
    if (res) {
      message.error("课程时间存在冲突, 请重新选择时间");
    } else {
      await updateCourseOpr({ week: dataIndex, id: courseId, course });
      await waitAndRefreshPage(navigate, 0.5);
    }
  };

  const handleEditWeek = async () => {
    formModalHandler.open<WeekFieldType>({
      modalProps: {
        title: "修改当前周数",
        cancelText: "取消",
        okText: "修改",
        onOk: async (values) => {
          await updateWeekOpr(values);
          await waitAndRefreshPage(navigate, 0.5);
        },
      },
      formChildren: renderEditWeekFormChildren(),
      initialValue: {
        week: Number(currentWeek),
      },
    });
  };

  useEffect(() => {
    setPreviewWeek(Number(currentWeek));
    if (Number(currentWeek) !== 0) {
      notification.open({
        message: "下周课程变动提醒",
        description: renderNextWeekCoursesNotice(),
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        duration: 5,
      });
    }
  }, [currentWeek]);

  useEffect(() => {
    findAllCourseOpr();
  }, []);

  return (
    <div className="course-table">
      <header className="header">
        <div className="preview-week">
          <span>教学周：</span>
          <Select
            defaultValue={previewWeek}
            key={new Date().getTime()}
            style={{ width: 120 }}
            onChange={(e) => setPreviewWeek(e)}
            options={getWeekOptions()}
          />
        </div>
        <div className="current-week">
          <span>当前周数：第 {courseInfo.currentWeek} 周</span>
          <span className="edit-week-icon" onClick={handleEditWeek}>
            <EditOutlined />
          </span>
        </div>
      </header>
      <SchedulingTable
        previewWeek={previewWeek}
        courseInfo={courseInfo}
        store={courseTableStore}
        handleCreate={handleCreate}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      ></SchedulingTable>
    </div>
  );
});

export default CourseTable;
