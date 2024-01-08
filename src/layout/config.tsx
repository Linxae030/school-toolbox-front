import { UserOutlined } from "@ant-design/icons";
import getMenuItem from "@/utils/getMenuItem";

const menuItems = [
  getMenuItem("课程表", "timetable", <UserOutlined />),
  getMenuItem("我的简历", "resume", <UserOutlined />, [
    getMenuItem("简历制作", "resume/edit", <UserOutlined />),
    getMenuItem("简历列表", "resume/list", <UserOutlined />),
  ]),
  getMenuItem("文件收藏", "files", <UserOutlined />),
  getMenuItem("目标管理", "target", <UserOutlined />),
  getMenuItem("常用链接", "link", <UserOutlined />),
];

export default menuItems;
