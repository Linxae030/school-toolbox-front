import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { message } from "antd";
import { TOKEN_NAME_IN_LOCAL, getLocalStorageItem } from "@/utils";

export default function useWatchRoutes() {
  const previousPath = useRef("");
  const location = useLocation();
  const navigate = useNavigate();
  const token = getLocalStorageItem(TOKEN_NAME_IN_LOCAL);
  const path = location.pathname;
  useEffect(() => {
    if (!token) {
      message.warning("token失效，请重新登陆");
      navigate("/login");
    }
    previousPath.current = path;
  }, [path]);
}
