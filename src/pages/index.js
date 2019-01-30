import React from 'react';
import ChatBox from './../components/ChatBox';
import { connect } from 'dva';
import NewChatButton from './../components/NewChatButton';

const Index =
  ({ openWindows, addNewWindow, closeWindow, updateTextField, send, connect }) => {

  return (
    <div>
      {openWindows.map(window =>
        <ChatBox
          IP={window.IP}
          close={closeWindow}
          messages={window.messages}
          updateTextField={updateTextField}
          send={send}
          textAreaValue={window.textAreaValue}
          connect={connect}
        />
        )}
      <NewChatButton addNewWindow={addNewWindow}/>
    </div>
  );
};

export default connect(
  ({ global }) => global,
  dispatch => ({
    addNewWindow: () => dispatch({ type: 'global/addNewWindow' }),
    closeWindow: key => dispatch({ type: 'global/removeWindow', payload: key }),
    updateTextField: ({key, value}) => dispatch({ type: 'global/updateTextField', payload: { key, value } }),
    send: key => dispatch({ type: 'global/send', payload: key }),
    connect: ({key, IP}) => dispatch({ type: 'global/addNewConnection', payload: {key, IP} }),
  })
)(Index);
