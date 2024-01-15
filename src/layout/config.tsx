import {
  CalendarOutlined,
  FileDoneOutlined,
  FilePdfOutlined,
  FolderOpenOutlined,
  FundProjectionScreenOutlined,
  GlobalOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import getMenuItem from "@/utils/getMenuItem";

const menuItems = [
  getMenuItem("课程表", "timetable", <CalendarOutlined />),
  getMenuItem("我的简历", "resume", <IdcardOutlined />, [
    getMenuItem("简历制作", "resume/edit", <FileDoneOutlined />),
    getMenuItem("简历列表", "resume/list", <FilePdfOutlined />),
  ]),
  getMenuItem("文件收藏", "files", <FolderOpenOutlined />),
  getMenuItem("目标管理", "target", <FundProjectionScreenOutlined />),
  getMenuItem("常用链接", "link", <GlobalOutlined />),
];

export default menuItems;
