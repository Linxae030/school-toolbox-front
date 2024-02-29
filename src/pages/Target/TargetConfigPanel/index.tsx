import React from "react";
import "./index.less";
import { FileOutlined, CloseOutlined } from "@ant-design/icons";
import _, { remove } from "lodash";
import {
  Button,
  Collapse,
  CollapseProps,
  DatePicker,
  Form,
  Input,
  theme,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { Target } from "@/apis/target/types";
import ButtonGroup, { GroupButtonItem } from "@/components/ButtonGroup";
import HoverInput from "@/components/HoverInput";
import { ensureArray, waitAndRefreshPage } from "@/utils";
import DynamicTagSelector from "@/pages/Resume/DynamicTagSelector";
import TargetStore from "@/store/target/TargetStore";

type IProps = {
  target: Target;
  store: TargetStore;
  navigate: any;
};

const TargetConfigPanel = observer((props: IProps) => {
  const { target, store, navigate } = props;
  const {
    modifyTargetData,
    pushNewStep,
    removeStage,
    removeStep,
    pushNewStage,
    updateTargetOpr,
    deleteTargetOpr,
  } = store;
  const { _id, targetName, stages } = target;
  const { token } = theme.useToken();
  const panelStyle: React.CSSProperties = {
    marginBottom: 12,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  const handleSaveTarget = async () => {
    await updateTargetOpr();
    waitAndRefreshPage(navigate, 0.5);
  };

  const handleDeleteTarget = async () => {
    await deleteTargetOpr(_id);
    waitAndRefreshPage(navigate, 0.5);
  };

  const operationButtons: GroupButtonItem[] = _.compact([
    {
      showPopconfirm: true,
      children: "保存",
      type: "primary",
      icon: <FileOutlined />,
      popConfirmProps: {
        title: "保存目标",
        description: "确定要保存该目标吗？",
        onConfirm: handleSaveTarget,
      },
    },
    {
      showPopconfirm: true,
      children: "删除",
      type: "primary",
      danger: true,
      icon: <FileOutlined />,
      popConfirmProps: {
        title: "删除目标",
        description: "确定要删除该目标吗？",
        onConfirm: handleDeleteTarget,
      },
    },
  ]);
  const collapseItems: CollapseProps["items"] = ensureArray(toJS(stages)).map(
    (stage, index) => ({
      key: stage.stageTime,
      label: stage.stageName,
      extra: (
        <CloseOutlined
          onClick={() => {
            removeStage(index);
          }}
        />
      ),
      children: (
        <Form
          initialValues={{
            stageName: stage.stageName,
            stageTime: dayjs(stage.stageTime as string),
            items: stage.innerStepConfig?.items,
          }}
        >
          <Form.Item
            label="阶段名"
            name="stageName"
            rules={[{ required: true, message: "请输入内容标题" }]}
          >
            <Input
              placeholder="请输入内容标题"
              onChange={(val) =>
                modifyTargetData(`stages[${index}].stageName`, val.target.value)
              }
            />
          </Form.Item>
          <Form.Item label="时间范围" name="stageTime">
            <DatePicker
              format="YYYY.MM.DD"
              onChange={(val, dateString) =>
                modifyTargetData(`stages[${index}].stageTime`, dateString)
              }
            />
          </Form.Item>
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div
                style={{ display: "flex", rowGap: 16, flexDirection: "column" }}
              >
                {fields.map((field, _index) => (
                  <Collapse
                    size="small"
                    items={[
                      {
                        key: field.key,
                        label: `步骤 ${field.name + 1}`,
                        extra: (
                          <CloseOutlined
                            onClick={() => {
                              removeStep(index, _index);
                              remove(field.name);
                            }}
                          />
                        ),
                        children: (
                          <>
                            <Form.Item
                              label="步骤名"
                              name={[field.name, "title"]}
                              rules={[
                                { required: true, message: "请输入步骤名" },
                              ]}
                            >
                              <Input
                                placeholder="请输入内容标题"
                                onChange={(val) =>
                                  modifyTargetData(
                                    `stages[${index}].innerStepConfig.items[${_index}].title`,
                                    val.target.value,
                                  )
                                }
                              />
                            </Form.Item>
                            <Form.Item
                              label="步骤描述"
                              name={[field.name, "description"]}
                            >
                              <Input
                                placeholder="请输入步骤名"
                                onChange={(val) =>
                                  modifyTargetData(
                                    `stages[${index}].innerStepConfig.items[${_index}].description`,
                                    val.target.value,
                                  )
                                }
                              />
                            </Form.Item>
                          </>
                        ),
                      },
                    ]}
                    key={field.name}
                  />
                ))}
                <Button
                  type="dashed"
                  onClick={() => {
                    pushNewStep(index);
                    add();
                  }}
                  block
                >
                  添加新步骤
                </Button>
              </div>
            )}
          </Form.List>
        </Form>
      ),
      style: panelStyle,
    }),
  );
  return (
    <div className="target-config-panel">
      <header className="header">
        <HoverInput
          value={targetName}
          onChange={(val) => modifyTargetData("targetName", val.target.value)}
        ></HoverInput>
        <ButtonGroup buttons={operationButtons}></ButtonGroup>
      </header>
      <main>
        <Collapse
          items={collapseItems}
          size="small"
          bordered={false}
          style={{ background: token.colorBgContainer }}
        />
        <Button
          type="dashed"
          onClick={() => {
            pushNewStage();
          }}
          block
        >
          添加新阶段
        </Button>
      </main>
    </div>
  );
});

export default TargetConfigPanel;
