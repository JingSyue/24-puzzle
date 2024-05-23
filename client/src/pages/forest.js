    import React, { useEffect, useState, useRef } from 'react';
    import Head from 'next/head';

    import { useRouter } from 'next/router';
    import styles from '../styles/forest.module.css'; 

    export default function MySplineScene() {
        const [introTextIndex, setIntroTextIndex] = useState(0);
        const [wheelCount, setWheelCount] = useState(0);
        const introTextRef = useRef(null); 
        const router = useRouter(); 

        const introTexts = [
            '歡迎來到24號魔法森林',
            '從前從前，在四澤山裡住著24個小精靈。他們長期生活並在這裡建立了一個小聚落，彼此相互照應，共同維護著這片美好的森林。然而，這個平靜的森林並非一成不變。',
            '一天晚上，一個眼中充滿殘忍與邪惡的老巫婆突然來襲，將24個小精靈一一捉走，囚禁在黑暗的地牢中。',
            '被囚禁的小精靈們感到極度恐懼和絕望，每天都受到老巫婆的凌虐和威脅。他們渴望能夠重返自由、再次回到熟悉的森林中，但在強大的巫婆面前，他們感到無助而脆弱。',
            '然而，就在希望幾近破滅之際，他們發現只要解開密碼鎖上的謎題就能夠打開牢籠並逃離這裡。請大家幫助小精靈們逃離黑暗的地牢吧!',
            '準備開始你的冒險吧！',
        ];

        useEffect(() => {
            const handleWheel = (event) => {
                if (event.deltaY < 0) { 
                    setWheelCount((prev) => prev + 1);
                }
            };
            window.addEventListener('wheel', handleWheel);

           
            if (wheelCount >= 5 && introTextIndex < introTexts.length - 1) {
                setIntroTextIndex((prev) => prev + 1);
                setWheelCount(0); 
            }else if(wheelCount >= 5) {
                router.push('/');
            }

            return () => window.removeEventListener('wheel', handleWheel);
        }, [wheelCount, introTextIndex, router]);
     
        useEffect(() => {
            if (introTextRef.current) {
                const { bottom } = introTextRef.current.getBoundingClientRect();
                const blinkText = document.querySelector(`.${styles.blinkText}`);
                if (blinkText) {
                    blinkText.style.top = `${bottom + 20}px`; 
                }
            }
        }, [introTextIndex]);

        return (
            <>
                <Head>
                    <title>24號魔法森林</title>
                    <link rel="icon" href="/favicon.ico" />
                    <script type="module" src="https://unpkg.com/@splinetool/viewer@1.0.91/build/spline-viewer.js"></script>
                </Head>
                <spline-viewer url="https://prod.spline.design/sxCHpbPRcyLXJ1Zl/scene.splinecode"></spline-viewer>
                <div ref={introTextRef} className={`${styles.introText} ${styles.fadeIn}`}>
                    {introTexts[introTextIndex]}
                </div>
                <div className={`${styles.blinkText}`}>
                    向上滾動滑鼠進入森林
                </div>
            </>
        );
    }
