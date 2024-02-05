import React from "react";
import "./index.less";

import { Resume } from "@/apis/resume";

type IProps = Pick<Resume, "resumeConfig">;
const index = (props: IProps) => {
  return <div>index</div>;
};

export default index;
