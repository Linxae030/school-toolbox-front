/**
 * @component 简历结构树形展示组件
 */
import { Tree } from "antd";

type IProps = {
  treeData: any;
};
const ConfigFormTree = (props: IProps) => {
  const { treeData } = props;
  return (
    <div style={{ width: "90%" }}>
      <Tree
        showIcon
        defaultExpandAll
        treeData={treeData}
        blockNode
        onSelect={(selectedKeys, e) => {
          // @ts-expect-error 对的的
          e.node.callBack?.();
        }}
      />
    </div>
  );
};

export default ConfigFormTree;
