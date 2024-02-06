import { Tree } from "antd";

type IProps = {
  treeData: any;
};
const ConfigFormTree = (props: IProps) => {
  const { treeData } = props;
  return (
    <div>
      <Tree
        showIcon
        defaultExpandAll
        treeData={treeData}
        onSelect={(selectedKeys, e) => {
          console.log("selectedKeys", selectedKeys);
          console.log("e", e);
        }}
      />
    </div>
  );
};

export default ConfigFormTree;
