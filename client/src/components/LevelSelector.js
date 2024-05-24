//client\src\components\LevelSelector.js
import React from 'react';
import styles from '../styles/levelSelector.module.css';

const LevelSelector = ({ setLevel }) => (
  <div className={styles['level-selector']}>
    <button className={styles['level-button']} onClick={() => setLevel('easy')}>初級</button>
    <button className={styles['level-button']} onClick={() => setLevel('hard')}>高級</button>
  </div>
);

export default LevelSelector;
