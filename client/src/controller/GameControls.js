import React from 'react';

const StartButton = ({ handleStart }) => (
  <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 ease-in-out" onClick={handleStart}>
    開始
  </button>
);

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

const NextButton = ({ handleNext }) => (
  <button
    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200 ease-in-out"
    onClick={handleNext}
  >
    下一題
  </button>
);

const GameControls = ({ isStarted, isCorrect, isNext, solution, setSolution, handleStart, handleSubmit, handleNext }) => (
  <>
    {!isStarted && <StartButton handleStart={handleStart} />}
    {isStarted && !isCorrect && <SolutionInput solution={solution} setSolution={setSolution} handleSubmit={handleSubmit} />}
    {isStarted && isNext && <NextButton handleNext={handleNext} />}
  </>
);

export default GameControls;
