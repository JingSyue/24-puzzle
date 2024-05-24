import React, { useState, useEffect } from 'react';
import ElfModel from './ElfModel';  // 引入 ElfModel 組件
import GameControls from './GameControls';
import LevelSelector from './LevelSelector';
import ButtonPanel from './ButtonPanel';
import { fetchQuestion, submitSolution } from '../services/gameService';
import { useRouter } from 'next/router';
import successStyles from '../styles/success.module.css';
import gameStyles from '../styles/game.module.css';

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
  const [currentElfModel, setCurrentElfModel] = useState('');
  const [inputHistory, setInputHistory] = useState([]);
  const [errorCount, setErrorCount] = useState(0);
  const [startAnimation, setStartAnimation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (level && !userId) {
      const fetchInitialQuestion = async () => {
        const data = await fetchQuestion(null, level);
        setUserId(data.user_id);
        setNumbers(data.numbers);
        setMessage(data.message);
        setIsStarted(true);
        setStartAnimation(true);
      };
      fetchInitialQuestion();
    }
  }, [level]);

  useEffect(() => {
    if (collectedElves.length === 5) {
      router.push('/forest');
    }
  }, [collectedElves, router]);

  const handleLevelChange = selectedLevel => {
    setLevel(selectedLevel);
  };

  const handleButtonClick = value => {
    if (value === 'DEL') {
      setSolution(prev => prev.slice(0, -1));
    } else {
      setSolution(prev => prev + value);
    }
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
      const newElf = `elf${Math.floor(Math.random() * 24) + 1}`;
      setCollectedElves(prev => [...prev, newElf]);
      setCurrentElfModel(newElf);
      setErrorCount(0);
    } else {
      setSolution('');
      setErrorCount(prev => prev + 1);
      if (errorCount + 1 >= 3) {
        setTimeout(() => {
          handleNextQuestion();
        }, 5000);
      }
    }
  };

  const handleNextQuestion = async () => {
    setIsNext(false);
    setShowElfCard(false);
    const data = await fetchQuestion(userId, level);
    setNumbers(data.numbers);
    setMessage(data.message);
    setInputHistory([]);
    setIsCorrect(false);
    setErrorCount(0);
    setStartAnimation(true);
  };

  return (
    <div className={gameStyles.container}>
      <div className={gameStyles.panel}>
        {!isCorrect && <h1 className={gameStyles.header}>歡迎來到24號魔法森林!</h1>}
        {!isCorrect && isStarted && (
          <>
            <p className={gameStyles.instruction}>利用四則運算使運算結果為<span className={gameStyles.highlight}>24</span></p>
            <div className={gameStyles.numbers}>
              {numbers.map((number, index) => (
                <div key={index} className={gameStyles.number} style={{ animationDelay: `${index * 0.5}s` }}>
                  <div className={gameStyles.flipCard}>
                    <div className={gameStyles.flipCardInner + ' ' + (startAnimation ? gameStyles.flipped : '')}>
                      <div className={gameStyles.flipCardFront}></div>
                      <div className={gameStyles.flipCardBack}>{number}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {!isCorrect && !isStarted && <LevelSelector setLevel={handleLevelChange} />}
        {!isCorrect && isStarted && (
          <>
            <div className={gameStyles.inputContainer}>
              <input
                type="text"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="輸入你的式子"
                className={gameStyles.solutionInput}
              />
              <button onClick={handleSubmitSolution} className={gameStyles.submitButton}>提交</button>
            </div>
            <div className={gameStyles.buttonPanelContainer}>
              <ButtonPanel numbers={numbers} onButtonClick={handleButtonClick} />
            </div>
            <div className={gameStyles.historyContainer}>
              <h2 className={gameStyles.historyTitle}>历史记录</h2>
              <div className={gameStyles.historyTableContainer}>
                <table className={gameStyles.historyTable}>
                  <thead>
                    <tr>
                      <th>输入</th>
                      <th>结果</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inputHistory.map((entry, index) => (
                      <tr key={index}>
                        <td>{entry.solution}</td>
                        <td>{entry.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        {isCorrect && showElfCard && (
          <div className={successStyles['success-message']}>
            <h2 className="text-2xl font-bold">恭喜你解救了一個小精靈!</h2>
            <ElfModel modelName={currentElfModel} /> {/* 顯示隨機的 3D 模型 */}
            <button
              className={successStyles['next-button']}
              onClick={handleNextQuestion}
            >
              下一題
            </button>
          </div>
        )}
        {message && !isCorrect && <p className={`text-lg text-${isCorrect ? 'green' : 'red'}-500`}>{message}</p>}
      </div>
    </div>
  );
}
