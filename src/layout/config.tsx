import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const menuItems = [
  {
    key: "/timetable",
    icon: <UserOutlined />,
    label: "课程表",
  },
  {
    key: "/resume",
    icon: <VideoCameraOutlined />,
    label: "简历管理",
  },
  {
    key: "/files",
    icon: <UploadOutlined />,
    label: "文件收藏",
  },
  {
    key: "/target",
    icon: <UploadOutlined />,
    label: "目标管理",
  },
  {
    key: "/link",
    icon: <UploadOutlined />,
    label: "常用链接",
  },
];

export default menuItems;
