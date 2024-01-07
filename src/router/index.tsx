import { RouteObject } from "react-router-dom";

import AppLayout from "@/layout";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Timetable from "@/pages/Timetable";
import Resume from "@/pages/Resume";
import Files from "@/pages/Files";
import Target from "@/pages/Target";
import Link from "@/pages/Link";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/timetable",
        element: <Timetable />,
      },
      {
        path: "/resume",
        element: <Resume />,
      },
      {
        path: "/files",
        element: <Files />,
      },
      {
        path: "/target",
        element: <Target />,
      },
      {
        path: "/link",
        element: <Link />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
