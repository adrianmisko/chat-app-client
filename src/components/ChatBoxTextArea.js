import React from 'react';
import styles from './ChatBoxTextArea.css';
import TextField from '@material-ui/core/TextField';
import { Icon, Button } from 'antd';

const ChatBoxTextArea = ({ IP, send, updateTextField, textAreaValue, connect }) => {

  const handleChange = e => {
    e.preventDefault();
    updateTextField({
      key: IP,
      value: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (textAreaValue.slice(0, 8) === '/connect') {
      connect({ key: IP, IP: textAreaValue.slice(9, textAreaValue.length) });
    } else
      send(IP);
  };

  return (
    <div className={styles.container}>
    <form
        noValidate
        autoComplete="off"
        onSubmit={e => handleSubmit(e)}
      >
        <TextField
          id="standard-name"
          label="Type message..."
          className={styles['text-field']}
          margin="normal"
          value={textAreaValue}
          onChange={handleChange}
        />
      </form>
      <Button
        htmlType="button"
        type="primary"
        ghost
        className={styles.button}
        onClick={handleSubmit}
      >
        <Icon type="right" />
      </Button>
    </div>
  );
};

export default ChatBoxTextArea;
