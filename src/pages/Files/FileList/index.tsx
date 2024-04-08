import "./index.less";
import { Divider, Input, Tag } from "antd";
import Checkbox from "antd/es/checkbox";
import { observer } from "mobx-react-lite";
import { IFile, TagType } from "@/apis/files/types";
import FileCard from "../FileCard";
import FilterButtons from "@/components/FilterButtons";
import { FilterCondition } from "@/store/file";

type IProps = {
  selectedTags: TagType[];
  files: IFile[];
  onFileCheckChange?: (e: string[]) => void;
  onFileDelete?: (_id: string) => void;
  onFilesDelete?: (ids: string[]) => void;
  onFileDownload?: (_id: string) => void;
  onFilterConditionChange?: (condition: FilterCondition) => void;
};

const FileList = observer((props: IProps) => {
  const {
    selectedTags,
    files,
    onFileCheckChange,
    onFileDelete,
    onFileDownload,
    onFilterConditionChange,
  } = props;
  const hasTag = selectedTags.length !== 0;

  const buttons = [
    {
      name: "文件名",
      fieldName: "fileName",
    },
    {
      name: "大小",
      fieldName: "fileSize",
    },
    {
      name: "更新时间",
      fieldName: "updatedAt",
    },
  ];

  return (
    <div className="file-list">
      <header className="title">
        {hasTag ? (
          <>
            <span>含有标签：</span>
            {selectedTags.map((tag) => (
              <Tag color="blue" key={tag._id}>
                {tag.name}
              </Tag>
            ))}
          </>
        ) : (
          <>全部</>
        )}
      </header>
      <Divider
        dashed
        style={{ width: "100%", height: 1, borderWidth: 1, margin: "10px 0" }}
      />
      <div className="filter">
        <FilterButtons
          buttons={buttons}
          onChange={onFilterConditionChange}
        ></FilterButtons>
        <div className="keywords">
          <span style={{ width: "80px" }}>关键词：</span>
          <Input
            onChange={(e) =>
              onFilterConditionChange?.({
                keywords: e.target.value,
              })
            }
            placeholder="请输入关键词"
          ></Input>
        </div>
      </div>
      <div className="files-area">
        <Checkbox.Group
          style={{ width: "100%" }}
          onChange={onFileCheckChange as any}
        >
          {files.map((file) => (
            <FileCard
              key={file._id}
              file={file}
              onDelete={onFileDelete}
              onDownload={onFileDownload}
            ></FileCard>
          ))}
        </Checkbox.Group>
      </div>
    </div>
  );
});

export default FileList;
