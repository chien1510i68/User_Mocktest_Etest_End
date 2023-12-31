import { Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import { getListUserResults } from "../api/exam";
import { Link } from "react-router-dom";
const { Column } = Table;

const TableExamResults = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
  const email = JSON.parse(localStorage.getItem("email")) ; 
    getListUserResults({email : email })
      .then((res) => {
        console.log(res.data.data.items);
        setData(res.data.success === true ? res.data.data.items : null);
       
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);
  return (
    <>
      <Table dataSource={data}>
        <Column align="center" title="Tên bài thi " dataIndex="nameExam" key="nameExam" />
        <Column align="center" title="Điểm" dataIndex="point" key="point" />
        <Column align="center" title="Ngày thi" dataIndex="createDate" key="createDate" />
        <Column align="center" title="Thời gian thi" dataIndex="time" key="time" />
        <Column align="center" title="Nhận xét của giáo viên " dataIndex="comment" key="comment" />

        <Column align="center"
          title="Action"
          key="action"
          render={(_, record) => (
            <Space size="middle">
              <Link to={`/detail-results/${record.id}`}>Xem chi tiết </Link>
            </Space>
          )}
        />
      </Table>
    </>
  );
};

export default TableExamResults;
