import React, { useState } from "react";
import "./index.less";

import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import * as cx from "classnames";

import { FilterCondition } from "@/store/file";

import { ensureArray } from "@/utils";

type ButtonOptions = {
  name: string;
  fieldName: string;
};

type IProps = {
  buttons: ButtonOptions[];
  onChange?: (condition: FilterCondition) => void;
};

enum SortStatusEnum {
  "",
  "asc",
  "desc",
}

const SortStatusMap = ["", "asc", "desc"];

const FilterButtons = (props: IProps) => {
  const { buttons, onChange } = props;

  const [sortStatus, setSortStatus] = useState(0);
  const [currentField, setCurrentField] = useState("");

  const handleClick = (fieldName: string) => {
    const nextStatus = (sortStatus + 1) % 3;

    const condition: FilterCondition = {
      [fieldName]: SortStatusMap[nextStatus],
    };

    onChange?.(condition);
    setCurrentField(fieldName);
    setSortStatus(fieldName !== currentField ? 1 : nextStatus);
  };

  return (
    <div className="filter-buttons">
      {ensureArray(buttons).map((button) => (
        <div
          className="button"
          onClick={() => handleClick(button.fieldName)}
          key={button.fieldName}
        >
          <span className="filter-name"> {button.name}</span>{" "}
          <div className="button">
            <CaretUpOutlined
              className={cx("asc", {
                active:
                  sortStatus === SortStatusEnum.asc &&
                  currentField === button.fieldName,
              })}
            />
            <CaretDownOutlined
              className={cx("desc", {
                active:
                  sortStatus === SortStatusEnum.desc &&
                  currentField === button.fieldName,
              })}
            />{" "}
          </div>{" "}
        </div>
      ))}
    </div>
  );
};

export default FilterButtons;
