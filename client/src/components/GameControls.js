//client\src\components\GameControls.js
import React from 'react';
import StartButton from './StartButton';
import SolutionInput from './SolutionInput';
import NextButton from './NextButton';

const GameControls = ({ isStarted, isCorrect, isNext, solution, setSolution, handleStart, handleSubmit, handleNext }) => (
  <>
    {!isStarted && <StartButton handleStart={handleStart} />}
    {isStarted && !isCorrect && <SolutionInput solution={solution} setSolution={setSolution} handleSubmit={handleSubmit} />}
    {isStarted && isNext && <NextButton handleNext={handleNext} />}
    {isStarted && isCorrect && <NextButton handleNext={handleNext} />} 
  </>
);

export default GameControls;
