import React from 'react';
import { Paper } from '@material-ui/core';
import styles from './ChatBoxBody.css';
import classNames from 'classnames';

class ChatBoxBody extends React.Component {

  userPaper = classNames(styles.paper, styles['paper-user']);
  anotherPaper = classNames(styles.paper, styles['paper-another']);

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  };

  componentDidMount() {
    this.scrollToBottom();
  };

  componentDidUpdate() {
    this.scrollToBottom();
  };

  render() {
    return (
      <div className={styles.container}>
        {this.props.messages.map(message =>
          (message.author === 'user' ?
            <Paper
              className={this.userPaper}
            >
              {message.text}
            </Paper>
            :
            <Paper
              className={this.anotherPaper}
            >
              {message.text}
            </Paper>))}
            <div className={styles.dummy} ref={(el) => { this.messagesEnd = el; }}> </div>
      </div>
    );
  };
}

export default ChatBoxBody;
