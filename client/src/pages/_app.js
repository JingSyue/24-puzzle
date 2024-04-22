// pages/_app.js
import React from 'react';
import Head from 'next/head';
import '../styles/globals.css';



function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Head>
        <title>24-puzzle</title>
        <link rel="icon" href="/images/favicon.png" />
      </Head>
    </>
  );
}

export default MyApp;