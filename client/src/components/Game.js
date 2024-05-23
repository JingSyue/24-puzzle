import React, { useState, useEffect } from 'react';
import Elf from './Elf';
import GameControls from '../controller/GameControls';
import LevelSelector from '../controller/LevelSelector';
import { fetchQuestion, submitSolution } from '../services/gameService';
import { useRouter } from 'next/router';

export default function Game() {
  const [level, setLevel] = useState('');
  const [userId, setUserId] = useState('');
  const [numbers, setNumbers] = useState([]);
  const [solution, setSolution] = useState('');
  const [message, setMessage] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [collectedElves, setCollectedElves] = useState([]);
  const [showElfCard, setShowElfCard] = useState(false);
  const [inputHistory, setInputHistory] = useState([]); 
  const [errorCount, setErrorCount] = useState(0); 
  const router = useRouter();

  useEffect(() => {
    if (level && !userId) {
      const fetchInitialQuestion = async () => {
        const data = await fetchQuestion(null, level);  // Sending null or omit userId
        setUserId(data.user_id);
        setNumbers(data.numbers);
        setMessage(data.message);
        setIsStarted(true);
      };
      fetchInitialQuestion();
    }
  }, [level]);

  useEffect(() => {
    if (collectedElves.length === 3) {
      router.push('/forest');
    }
  }, [collectedElves, router]);

  const handleLevelChange = selectedLevel => {
    setLevel(selectedLevel);
  };

  const handleSubmitSolution = async () => {
    const data = await submitSolution(userId, solution, numbers);
    setMessage(data.message);
    setIsCorrect(data.correct);
    setInputHistory(data.input_history);
    if (data.correct) {
      setSolution('');
      setIsNext(true);
      setShowElfCard(true);
      const newElf = `elf${Math.floor(Math.random() * 24) + 1}.png`;
      setCollectedElves(prev => [...prev, newElf]);
      setErrorCount(0); 
    } else {
      setErrorCount(prev => prev + 1);
      if (errorCount + 1 >= 3) {
        setTimeout(() => {
          handleNextQuestion();
        }, 3000); 
      }
    }
  };

  const handleNextQuestion = async () => {
    setIsNext(false);
    setShowElfCard(false);
    const data = await fetchQuestion(userId, level);  // Fetch new question logic
    setNumbers(data.numbers);
    setMessage(data.message);
    setInputHistory([]);  // Reset input history for the new question
    setIsCorrect(false);  // Reset correctness check
    setErrorCount(0);  // 重置错误次数
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('images/background.jpg')", minHeight: '100vh', minWidth: '100vw' }}>
      <div className="mt-4 sm:mt-8 lg:mt-16 xl:mt-24">
        <h1 className="text-4xl sm:text-6xl font-bold mb-8 text-white shadow-lg p-4 bg-opacity-60 bg-black rounded-lg" style={{ backdropFilter: 'blur(5px)' }}>
          歡迎來到24號魔法森林!
        </h1>
        {!isStarted && <LevelSelector setLevel={handleLevelChange} />}
        {isStarted && (
          <>
            <p className="text-lg font-semibold">{numbers.join(', ')}</p>
            <GameControls
              isStarted={isStarted}
              isCorrect={isCorrect}
              isNext={isNext}
              solution={solution}
              setSolution={setSolution}
              handleStart={() => { }}
              handleSubmit={handleSubmitSolution}
              handleNext={handleNextQuestion}
            />
            <div className="mt-4">
              <h2 className="text-2xl font-bold">歷史紀錄</h2>
              {inputHistory.map((entry, index) => (
                <div key={index}>
                  <p>輸入: {entry.solution}</p>
                  <p>結果: {entry.message}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {showElfCard && collectedElves.length > 0 && <Elf collectedElves={collectedElves.slice(-1)} />}
      {message && <p className={`text-lg text-${isCorrect ? 'green' : 'red'}-500`}>{message}</p>}
    </div>
  );
}
