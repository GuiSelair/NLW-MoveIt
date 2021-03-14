import { useCallback, useMemo, useState, useEffect } from 'react';

import styles from '../styles/components/Countdown.module.css';

import { useChallenges } from '../contexts/ChallengesContext';

let countdownTimeout: NodeJS.Timeout;

const Countdown = () => {
  const [time, setTime] = useState(0.1 * 60);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const { startNewChallenge } = useChallenges();

  const [minuteLeft, minuteRight] = useMemo(() => {
    const minutes = Math.floor(time / 60);
    return String(minutes).padStart(2, '0').split('');
  }, [time]);

  const [secondLeft, secondRight] = useMemo(() => {
    const seconds = Math.floor(time % 60);
    return String(seconds).padStart(2, '0').split('');
  }, [time]);


  const handleStartCountdownClick = useCallback(() => {
    setIsActive(true);
  }, []);

  const handleResetCoundownClick = useCallback(() => {
    clearTimeout(countdownTimeout);
    setIsActive(false);
    setTime(0.5 * 60);
  }, []);

  useEffect(() => {
    if (isActive && time > 0){
      countdownTimeout = setTimeout(() => {
        setTime(time - 1);
      }, 1000)
    } else if (isActive && time === 0){
      setHasFinished(true);
      setIsActive(false);
      startNewChallenge();
    }
  }, [isActive, time]);

	return (
		<>
      <div className={styles.countdownContainer}>
        <div>
          <span>{minuteLeft}</span>
          <span>{minuteRight}</span>
        </div>
        <span>:</span>
        <div>
          <span>{secondLeft}</span>
          <span>{secondRight}</span>
        </div>
      </div>

      {hasFinished ? (
        <button className={styles.countdownButton} disabled >Ciclo encerrado</button>
      ) : (
        <>
          {isActive ? (
            <button type="button" className={`${styles.countdownButton} ${styles.countdownButtonActive}`} onClick={handleResetCoundownClick}>Abandonar ciclo</button>
            ) : (
            <button type="button" className={styles.countdownButton} onClick={handleStartCountdownClick}>Iniciar um ciclo</button>

          )}
        </>
      )}

      
		</>
	);
}

export default Countdown;