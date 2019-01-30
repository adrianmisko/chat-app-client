import React from 'react';
import { Modal } from 'antd';
import ServerInfoForm from '@/components/ServerInfoForm';

const ConnectToServer = ({ visible, toggleVisible }) => {

  return (
    <Modal
      visible={visible}
      footer={null}
      closable={false}
      maskClosable
      onCancel={toggleVisible}
    >
      <ServerInfoForm />
    </Modal>
  );
};

export default ConnectToServer;
