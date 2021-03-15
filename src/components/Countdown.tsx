import { useCallback, useMemo, useState, useEffect } from 'react';

import styles from '../styles/components/Countdown.module.css';

import { useCountdown } from '../contexts/CountdownContext';

const Countdown = () => {
  const {hasFinished, isActive, minutes, seconds, reset, start} = useCountdown();


  const [minuteLeft, minuteRight] = String(minutes).padStart(2, '0').split('');

  const [secondLeft, secondRight] = String(seconds).padStart(2, '0').split('');

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
            <button type="button" className={`${styles.countdownButton} ${styles.countdownButtonActive}`} onClick={reset}>Abandonar ciclo</button>
            ) : (
            <button type="button" className={styles.countdownButton} onClick={start}>Iniciar um ciclo</button>

          )}
        </>
      )}

      
		</>
	);
}

export default Countdown;