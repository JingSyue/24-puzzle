// pages/index.js
import React from 'react';
import Head from 'next/head';
import Game from '../components/Game';


export default function Home() {
  return (
    <>
  
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <Game />
      </div>
    </>
  );
}
