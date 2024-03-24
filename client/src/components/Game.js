// components/Game.js
import React, { useState } from 'react';
import { fetchQuestion, submitSolution } from '../services/gameService';

export default function Game() {
  const [userId, setUserId] = useState('');
  const [numbers, setNumbers] = useState([]);
  const [solution, setSolution] = useState('');
  const [message, setMessage] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false); // 新增状态用于跟踪答案是否正确

  const handleFetchQuestion = async () => {
    const data = await fetchQuestion(userId);
    setUserId(data.user_id);
    setNumbers(data.numbers);
    setMessage(data.message);
    setIsStarted(true);
    setIsNext(false);
    setIsCorrect(false); // 获取新题目时重置答案状态
  };

  const handleSubmitSolution = async () => {
    const data = await submitSolution(userId, solution, numbers);
    setMessage(data.message);
    setIsCorrect(data.correct); // 更新答案状态

    // 如果答案正确，设置 isNext 为 true 表示可以显示 "Next" 按钮
    if (data.correct) {
      setSolution('');
      setIsNext(true);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 space-y-4">
      <h1 className="text-4xl font-bold mb-8">Welcome to the 24 Game!</h1>



      <p className="text-lg font-semibold">
        {numbers.length > 0 ? numbers.join(', ') : ''}
      </p>

      <div className="flex space-x-4 items-center">
        {!isStarted && (
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            onClick={handleFetchQuestion}
          >
            Start
          </button>
        )}



        {isStarted && !isCorrect && (
          <>
            <input
              type="text"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Enter your solution"
              className="border-2 border-gray-300 rounded p-2"
            />
            <button
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
              onClick={handleSubmitSolution}
            >
              Submit
            </button>
          </>
        )}

        {isStarted && isNext && (
          <button
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
            onClick={handleFetchQuestion} // 点击 "Next" 应该获取新题目
          >
            Next
          </button>
        )}
      </div>

      {message && (
        <p className={`text-lg ${isCorrect ? "text-green-500" : "text-black-500"}`}>{message}</p>
      )}

    </div>
  );
}
