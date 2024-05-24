//client\src\components\NextButton.js
import React from 'react';

const NextButton = ({ handleNext }) => (
  <button
    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200 ease-in-out mt-4"
    onClick={handleNext}
  >
    下一題
  </button>
);

export default NextButton;
