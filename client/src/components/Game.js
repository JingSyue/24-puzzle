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
    if (data.correct) {
      setSolution('');
      setIsNext(true);
      setShowElfCard(true);
      const newElf = `elf${Math.floor(Math.random() * 24) + 1}.png`;
      setCollectedElves(prev => [...prev, newElf]);
    }
  };

  const handleNextQuestion = async () => {
    setIsNext(false);
    setShowElfCard(false);
    const data = await fetchQuestion(userId, level);  // Fetch new question logic
    setNumbers(data.numbers);
    setMessage(data.message);
    setIsCorrect(false);  // Reset correctness check
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4" style={{ backgroundImage: "url('images/background.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '100vh', minWidth: '100vw' }}>
      <div className="mt-10 sm:mt-20">
        <h1 className="text-4xl font-bold mb-8">歡迎來到24號魔法森林!</h1>
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
              handleStart={() => {}}
              handleSubmit={handleSubmitSolution}
              handleNext={handleNextQuestion}
            />
          </>
        )}
      </div>
      {showElfCard && collectedElves.length > 0 && <Elf collectedElves={collectedElves.slice(-1)} />}
      {message && <p className={`text-lg text-${isCorrect ? 'green' : 'red'}-500`}>{message}</p>}
    </div>
  );
}