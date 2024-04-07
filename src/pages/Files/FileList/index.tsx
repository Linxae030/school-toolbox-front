import "./index.less";
import { Divider, Tag } from "antd";
import Checkbox from "antd/es/checkbox";
import { IFile, TagType } from "@/apis/files/types";
import FileCard from "../FileCard";

type IProps = {
  selectedTags: TagType[];
  files: IFile[];
  onFileCheckChange?: (e: string[]) => void;
  onFileDelete?: (_id: string) => void;
  onFilesDelete?: (ids: string[]) => void;
  onFileDownload?: (_id: string) => void;
};

const FileList = (props: IProps) => {
  const {
    selectedTags,
    files,
    onFileCheckChange,
    onFileDelete,
    onFilesDelete,
    onFileDownload,
  } = props;
  const hasTag = selectedTags.length !== 0;

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
};

export default FileList;
