import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';

import { useChallenges } from './ChallengesContext';

interface ICountdownProvider {
    children: ReactNode;
} 

interface ICountdownContextData{
    reset: () => void;
    start: () => void;
    minutes: number;
    seconds: number;
    isActive: boolean;
    hasFinished: boolean;
}

let countdownTimeout: NodeJS.Timeout;

const countdownContext = createContext({} as ICountdownContextData);

const CountdownProvider = ({ children }: ICountdownProvider) => {
    const [time, setTime] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);
    const { startNewChallenge } = useChallenges();

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    const start = useCallback(() => {
        setIsActive(true);
    }, []);

    const reset = useCallback(() => {
        clearTimeout(countdownTimeout);
        setIsActive(false);
        setHasFinished(false);
        setTime(25 * 60);
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
        <countdownContext.Provider value={{ start, reset, minutes, seconds, isActive, hasFinished }}>
            { children }
        </countdownContext.Provider>
    )
};

const useCountdown = () => {
    const context = useContext(countdownContext);

    if (!context) throw new Error("[ERROR]: useCountdown must be used with countdownProvider");

    return context;
};

export {
    useCountdown,
    CountdownProvider,
}