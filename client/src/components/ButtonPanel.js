//components/ButtonPanel.js
import React from 'react';
import buttonPanelStyles from '../styles/buttonPanel.module.css';

const ButtonPanel = ({ numbers, onButtonClick }) => (
  <div className={buttonPanelStyles.panel}>
    <div className={buttonPanelStyles.buttonRow}>
      {numbers.map((number, index) => (
        <button
          key={index}
          className={buttonPanelStyles.button}
          onClick={() => onButtonClick(number.toString())}
        >
          {number}
        </button>
      ))}
    </div>
    <div className={buttonPanelStyles.buttonRow}>
      {['+', '-', '*', '/', '(', ')', 'DEL'].map((symbol, index) => (
        <button
          key={index}
          className={buttonPanelStyles.button}
          onClick={() => onButtonClick(symbol)}
        >
          {symbol === 'DEL' ? '⟵' : symbol}
        </button>
      ))}
    </div>
  </div>
);

export default ButtonPanel;
