//client\src\components\StartButton.js
import React from 'react';

const StartButton = ({ handleStart }) => (
  <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 ease-in-out" onClick={handleStart}>
    開始
  </button>
);

export default StartButton;
