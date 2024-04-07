// components/Elf.js
import React from 'react';
import styles from '../styles/card.module.css'; // 确保正确导入CSS文件

// 添加 props 参数来接收从 Game 组件传递的 collectedElves
const Elf = ({ collectedElves }) => {
  return (
    <div className={styles.container}>
      {collectedElves && collectedElves.map((elf, index) => (
        <div key={index} className={styles.flyIn}>
          <img src={`/images/${elf}`} alt={`Elf ${index + 1}`} />
        </div>
      ))}
    </div>
  );
};

export default Elf;
