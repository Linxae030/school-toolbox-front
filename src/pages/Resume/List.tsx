import "./list.less";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { toJS } from "mobx";
import { Row, Col, Card, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import useStore from "@/store";
import { formatISO, mapRender, waitAndRefreshPage } from "@/utils";

const List = observer(() => {
  const navigate = useNavigate();
  const { resumeStore } = useStore();
  const { resumeList, findAllResumeOpr, deleteResumeOpr } = resumeStore;

  useEffect(() => {
    findAllResumeOpr();
  }, []);

  const handleGoEdit = (_id: string) => {
    navigate(`/resume/edit/${_id}`);
  };

  const handleDeleteResume = async (_id: string) => {
    await deleteResumeOpr(_id);
    await waitAndRefreshPage(navigate, 0.5);
  };

  const renderCardTitle = (resumeName: string, _id: string) => {
    return (
      <div className="card-title">
        <span>{resumeName}</span>
        <div className="operations">
          <EditOutlined className="icon" onClick={() => handleGoEdit(_id)} />
          <Popconfirm
            title="删除链接"
            description="你确定要删除这个简历吗？"
            onConfirm={() => handleDeleteResume(_id)}
            okText="是"
            cancelText="否"
          >
            <span className="operation-button delete-button">
              <DeleteOutlined className="icon" />
            </span>
          </Popconfirm>
        </div>
      </div>
    );
  };

  return (
    <div className="resume-list-container">
      <Row gutter={[16, 16]}>
        {mapRender(toJS(resumeList), (resume, index) => (
          <Col span={8} key={index}>
            <Card
              title={renderCardTitle(resume.resumeName, resume._id)}
              bordered={false}
            >
              最后一次更新于：{formatISO(resume.updatedAt)}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
});

export default List;
