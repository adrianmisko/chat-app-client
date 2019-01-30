import React from 'react';
import { MD5 } from 'crypto-js';
import { Avatar } from '@material-ui/core';
import { Button, Icon } from 'antd';
import styles from './ChatBoxHeader.css';


const ChatBoxHeader = ({ IP, close }) => {

  const handleClose = () => {
    close(IP);
  };

  return (
    <div className={styles.container}>
      <Avatar
        alt={'IP\'s gravatar'}
        src={`https://www.gravatar.com/avatar/${MD5(IP)}?d=identicon&s=50`}
        className={styles.avatar}
      />
      <div className={styles['title-wrapper']}>
        <h2 className={styles.title}>
          {IP}
        </h2>
      </div>
      <Button
        onClick={handleClose}
        type="danger"
        shape="circle"
        htmlType="button"
        className={styles['exit-button']}
      >
        <Icon type="close" className={styles.icon}/>
      </Button>
    </div>
  );
};

export default ChatBoxHeader;
