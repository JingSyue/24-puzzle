import React from 'react';
import styles from '../styles/card.module.css';

const Elf = ({ collectedElves }) => (
  <div className={styles.container}>
    {collectedElves.map((elf, index) => (
      <div key={index} className={styles.flyIn}>
        <img src={`/images/${elf}`} alt={`Elf ${index + 1}`} onError={(e) => e.target.style.display = 'none'} />
      </div>
    ))}
  </div>
);

export default Elf;
