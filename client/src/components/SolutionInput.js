//client\src\components\SolutionInput.js
import React from 'react';

const SolutionInput = ({ solution, setSolution, handleSubmit }) => (
  <div>
    <input
      type="text"
      value={solution}
      onChange={(e) => setSolution(e.target.value)}
      placeholder="輸入你的式子"
      className="border-2 border-gray-300 rounded p-2 mr-2"
    />
    <button
      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200 ease-in-out"
      onClick={handleSubmit}
    >
      提交
    </button>
  </div>
);

export default SolutionInput;
