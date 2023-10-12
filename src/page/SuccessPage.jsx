import { Modal } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SuccessPage({openModal}) {
    const [isModalOpen, setIsModalOpen] = useState(openModal);
   
    const handleOk = () => {
      setIsModalOpen(false);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    return (
        <div>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
            <h2>Chúc mừng bạn đã hoàn thành xong phần thi </h2>
          <Link>  Click vào đây để biết điểm thi </Link>
        </div>
    );
}

export default SuccessPage;