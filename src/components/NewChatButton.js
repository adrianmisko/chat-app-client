import React from 'react';
import styles from './NewChatButton.css';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const NewChatButton = ({ addNewWindow }) => {

  return (
    <div className={styles.container}>
      <div className={styles.newChatButton}>
        <Fab
          color="primary"
          aria-label="Add"
          onClick={addNewWindow}
        >
          <AddIcon />
        </Fab>
      </div>
    </div>
  );
};

export default NewChatButton;
