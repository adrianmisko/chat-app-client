import React from 'react';
import styles from './NewConnectionButton.css';
import Fab from '@material-ui/core/Fab';
import { Icon } from 'antd';

const NewConnectionButton = ({ toggleVisible }) => {

  return (
    <div className={styles.container}>
      <div className={styles.newConnectionButton}>
        <Fab
          color="secondary"
          aria-label="Add"
          onClick={toggleVisible}
        >
          <Icon type="cluster" />
        </Fab>
      </div>
    </div>
  );
};

export default NewConnectionButton;
