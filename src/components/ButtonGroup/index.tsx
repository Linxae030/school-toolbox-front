import { Button, Flex, Popconfirm, PopconfirmProps } from "antd";
import { ButtonProps } from "antd/es/button";
import Dropdown, { DropdownButtonProps } from "antd/es/dropdown";
import * as _ from "lodash";
import { mapRender } from "../../utils/utils";

export type IButtonProps = (ButtonProps | DropdownButtonProps) & {
  isDropDown?: boolean;
  showPopconfirm?: boolean;
  popConfirmProps?: PopconfirmProps;
};

type IProps = {
  buttons: IButtonProps[];
};

const ButtonGroup = (props: IProps) => {
  const { buttons } = props;
  return (
    <Flex
      gap="small"
      align="flex-start"
      style={{
        margin: "5px 0",
      }}
    >
      {mapRender(buttons, (config, index) => {
        const { isDropDown, showPopconfirm, popConfirmProps, ...rest } = config;
        const button = isDropDown ? (
          <Dropdown.Button {...rest} key={index} />
        ) : (
          <Button {...rest} key={index} />
        );
        return showPopconfirm ? (
          <Popconfirm
            key={index}
            okText="是"
            cancelText="否"
            {...popConfirmProps!}
          >
            <Button {...rest} key={index} />
          </Popconfirm>
        ) : (
          button
        );
      })}
    </Flex>
  );
};

export default ButtonGroup;
