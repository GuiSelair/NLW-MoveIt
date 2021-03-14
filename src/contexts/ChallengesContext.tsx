import { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import challenges from '../../challenges.json';

interface IChallengesProvider {
    children: ReactNode;
}

interface IChallengesContextData {
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    levelUp: () => void;
    startNewChallenge: () => void;
    activeChallenge: {
        description: string;
        type: "body" | "eye";
        amount: number;
    }
    resetChallenge: () => void;
    experienceToNextLevel: number;
}

export const challengesContext = createContext({} as IChallengesContextData);

export function ChallengesProvider({ children }: IChallengesProvider) {
    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);
    const [activeChallenge, setActiveChallenge] = useState(null);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

    const levelUp = useCallback(() => {
        setLevel(level + 1);
    }, []);

    const resetChallenge = useCallback(() => {
        setActiveChallenge(null);
    }, []);

    const startNewChallenge = useCallback(() => {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];
        setActiveChallenge(challenge);
    }, []);

    return (
    <challengesContext.Provider value={{ level, currentExperience, challengesCompleted, levelUp, startNewChallenge, activeChallenge, resetChallenge, experienceToNextLevel }}>
        { children }
    </challengesContext.Provider>  
    )
}

export const useChallenges = () => {
    const context = useContext(challengesContext);

    if (!context) throw new Error("[ERROR]: useChallenges must be used with ChallengesProvider");

    return context;
}