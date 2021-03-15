import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import LevelUpModal from '../components/LevelUpModal';
import Cookies from 'js-cookie';
import challenges from '../../challenges.json';

interface IChallengesProvider {
    children: ReactNode;
    level: number;
    currentExperience: number;
    challengesCompleted: number;
}

interface IChallenge {
    description: string;
    type: string;
    amount: number;
}

interface IChallengesContextData {
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    levelUp: () => void;
    startNewChallenge: () => void;
    activeChallenge: IChallenge;
    resetChallenge: () => void;
    experienceToNextLevel: number;
    completeChallenge: () => void;
    closeLevelUpModal: () => void;
}

export const challengesContext = createContext({} as IChallengesContextData);

export function ChallengesProvider({ children, ...rest }: IChallengesProvider) {
    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);
    const [activeChallenge, setActiveChallenge] = useState<IChallenge | null>(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    useEffect(() => {
        Notification.requestPermission();
    }, []);

    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengesCompleted', String(challengesCompleted));
    }, [level, currentExperience, challengesCompleted]);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

    const levelUp = useCallback(() => {
        setLevel(level + 1);
        setIsLevelUpModalOpen(true);
    }, [level]);

    const resetChallenge = useCallback(() => {
        setActiveChallenge(null);
    }, []);

    const closeLevelUpModal = useCallback(() => {
        setIsLevelUpModalOpen(false);
    }, []);

    const startNewChallenge = useCallback(() => {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];
        setActiveChallenge(challenge);

        if (Notification.permission === "granted"){
            new Notification("Novo desafio!! ", {
                body:`Valendo ${challenge.amount}xp`,
            });
        }

    }, []);

    const completeChallenge = useCallback(() => {
        if (!activeChallenge) return;

        const { amount } = activeChallenge;
        let finalExperience = currentExperience + amount;

        if (finalExperience >= experienceToNextLevel){
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }
        
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
        setCurrentExperience(finalExperience);

    }, [activeChallenge, levelUp, challengesCompleted, experienceToNextLevel]);

    return (
    <challengesContext.Provider value={{ level, currentExperience, challengesCompleted, levelUp, startNewChallenge, activeChallenge, resetChallenge, experienceToNextLevel, completeChallenge, closeLevelUpModal }}>
        { children }
        {isLevelUpModalOpen && <LevelUpModal />}
    </challengesContext.Provider>  
    )
}

export const useChallenges = () => {
    const context = useContext(challengesContext);

    if (!context) throw new Error("[ERROR]: useChallenges must be used with ChallengesProvider");

    return context;
}