// Game.js
import React, { useState, useEffect } from 'react';
import Elf from './Elf';
import { fetchQuestion, submitSolution } from '../services/gameService';
import { useRouter } from 'next/router';

const GameControls = ({ isStarted, isCorrect, isNext, solution, setSolution, handleStart, handleSubmit, handleNext }) => {
  if (!isStarted) {
    return <StartButton handleStart={handleStart} />;
  }
  if (isStarted && !isCorrect) {
    return <SolutionInput solution={solution} setSolution={setSolution} handleSubmit={handleSubmit} />;
  }
  if (isStarted && isNext) {
    return <NextButton handleNext={handleNext} />;
  }
  return null;
};

const StartButton = ({ handleStart }) => (
  <button
    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
    onClick={handleStart}
  >
    開始
  </button>
);

const SolutionInput = ({ solution, setSolution, handleSubmit }) => (
  <>
    <input
      type="text"
      value={solution}
      onChange={(e) => setSolution(e.target.value)}
      placeholder="輸入你的式子"
      className="border-2 border-gray-300 rounded p-2"
    />
    <button
      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
      onClick={handleSubmit}
    >
      提交
    </button>
  </>
);

const NextButton = ({ handleNext }) => (
  <button
    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
    onClick={handleNext}
  >
    下一題
  </button>
);

export default function Game() {
  const [userId, setUserId] = useState('');
  const [numbers, setNumbers] = useState([]);
  const [solution, setSolution] = useState('');
  const [message, setMessage] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [collectedElves, setCollectedElves] = useState([]);
  const [showElfCard, setShowElfCard] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (collectedElves.length === 3) {
      router.push('/forest');
    }
  }, [collectedElves, router]);

  const selectRandomElf = () => {
    let newElf;
    do {
      newElf = `elf${Math.floor(Math.random() * 24) + 1}.png`;
    } while (collectedElves.includes(newElf));
    return newElf;
  };

  const handleFetchQuestion = async () => {
    const data = await fetchQuestion(userId);
      setUserId(data.user_id);
      setNumbers(data.numbers);
      setMessage(data.message);
      setIsStarted(true);
      setIsNext(false);
      setIsCorrect(false);
      setShowElfCard(false); // 新题目时不显示Elf卡片

  };

  const handleSubmitSolution = async () => {
    const data = await submitSolution(userId, solution, numbers);
    setMessage(data.message);
    setIsCorrect(data.correct);
    if (data.correct) {
      setSolution('');
      setIsNext(true);
      setShowElfCard(true); // 答案正确时显示Elf卡片
      const newElf = selectRandomElf();
      setCollectedElves(prev => [...prev, newElf]);
    }
  };

  const handleNextQuestion = async () => {
    setIsNext(false);
    setShowElfCard(false); // 准备下一题时隐藏Elf卡片
    await handleFetchQuestion();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4"
         style={{
           backgroundImage: "url('images/background.jpg')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat',
           minHeight: '100vh',  // 確保至少與視口高度一致
           minWidth:'100vw'
         }}>
      <div className="mt-10 sm:mt-20">
        <h1 className="text-4xl font-bold mb-8">歡迎來到24號魔法森林!</h1>
        <p className="text-lg font-semibold">{numbers.join(', ')}</p>
        <GameControls
          isStarted={isStarted}
          isCorrect={isCorrect}
          isNext={isNext}
          solution={solution}
          setSolution={setSolution}
          handleStart={handleFetchQuestion}
          handleSubmit={handleSubmitSolution}
          handleNext={handleNextQuestion}
        />
      </div>
      {isCorrect && collectedElves.length > 0 && showElfCard && (
        <p className="text-green-500">恭喜！你救出了一隻新的精靈</p>
      )}
      {showElfCard && (
        <div className="flex space-x-2 mt-1">
          <Elf collectedElves={collectedElves.slice(-1)} />
        </div>
      )}
      {message && (
        <p className={`text-lg text-green-500`}>{message}</p>
      )}
    </div>
  );
}