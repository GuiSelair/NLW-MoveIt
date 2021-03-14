import { ChallengesProvider } from './ChallengesContext';

export default function ContextsProviders({ children }) {
    return (
        <ChallengesProvider>
            { children }
        </ChallengesProvider>
    );
}