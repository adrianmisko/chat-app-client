import { Rnd } from 'react-rnd';
import React from 'react';
import { Card } from '@material-ui/core';
import ChatBoxHeader from '@/components/ChatBoxHeader';
import ChatBoxBody from '@/components/ChatBoxBody';
import ChatBoxTextArea from '@/components/ChatBoxTextArea';
import styles from './ChatBox.css';

const ChatBox = ({ IP, close, send, updateTextField, messages, textAreaValue, connect }) => {

  const message = [{
    author: 'other',
    text: 'Type in /connect \<IP\> to connect'
  }];

  return (
    <Rnd
      default={{
        x: window.innerWidth/2 + Math.floor((Math.random() * 300) - 350),
        y: window.innerHeight/2  + Math.floor((Math.random() * 200) - 250),
      }}
      bounds="body"
    >
      <Card className={styles['chat-box']}>
        <ChatBoxHeader
          IP={IP}
          close={close}
        />
        <ChatBoxBody
          messages={IP === '?:?:?:?' ? message : messages}
        />
        <ChatBoxTextArea
          IP={IP}
          send={send}
          updateTextField={updateTextField}
          textAreaValue={textAreaValue}
          connect={connect}
        />
      </Card>
    </Rnd>
  );
};

export default ChatBox;
