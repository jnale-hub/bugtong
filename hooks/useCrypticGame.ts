import { ClueData } from '@/data/clues';
import { useCallback, useEffect, useState } from 'react';

export type GameStatus = 'playing' | 'won';

const getAnswerLengthFromEnumeration = (enumeration: string) => {
  const lengths = enumeration
    .split(',')
    .map((part) => parseInt(part.trim(), 10))
    .filter((n) => Number.isFinite(n));

  if (lengths.length > 0) {
    return lengths.reduce((sum, n) => sum + n, 0);
  }

  return enumeration.replace(/[^A-Za-z]/g, '').length;
};

export const useCrypticGame = (clue: ClueData) => {
  // Determine total answer length from enumeration like "5" or "3, 5"
  const totalLength = getAnswerLengthFromEnumeration(clue.enumeration);

  // Game state
  const [guess, setGuess] = useState<string[]>(Array(totalLength).fill(''));
  const [status, setStatus] = useState<GameStatus>('playing');
  const [shake, setShake] = useState(0); // used to trigger shake animation on wrong answer

  // indices that were revealed via hints and should not be deletable
  const [revealed, setRevealed] = useState<number[]>([]);

  // Which hint layers are visible
  const [hints, setHints] = useState({
    showIndicator: false,
    showFodder: false,
    showDefinition: false,
  });

  // Reset game state when the active clue changes
  useEffect(() => {
    const len = getAnswerLengthFromEnumeration(clue.enumeration);
    // Defer state updates to avoid synchronous setState inside an effect (prevents cascading renders)
    Promise.resolve().then(() => {
      setGuess(Array(len).fill(''));
      setStatus('playing');
      setHints({ showIndicator: false, showFodder: false, showDefinition: false });
      setRevealed([]);
    });
  }, [clue]);

  const handleInput = useCallback((char: string) => {
    if (status !== 'playing') return;
    const firstEmpty = guess.findIndex((l) => l === '');
    if (firstEmpty !== -1) {
      const newGuess = [...guess];
      // Normalize input to lowercase for consistent comparisons
      newGuess[firstEmpty] = char.toLowerCase();
      setGuess(newGuess);
    }
  }, [guess, status]);

  const handleBackspace = useCallback(() => {
    if (status !== 'playing') return;
    // find last filled index that's not revealed
    const revealedSet = new Set(revealed);
    const lastFilled = guess
      .map((_, i) => i)
      .reverse()
      .find((i) => guess[i] !== '' && !revealedSet.has(i));

    if (lastFilled !== undefined) {
      const newGuess = [...guess];
      newGuess[lastFilled] = '';
      setGuess(newGuess);
    }
  }, [guess, status, revealed]);

  // Compare normalized strings; return true when correct
  const checkAnswer = useCallback(() => {
    const currentGuess = guess.join('').toLowerCase();
    const correctAnswer = clue.answer.toLowerCase();

    if (currentGuess === correctAnswer) {
      setStatus('won');
      return true;
    }
    // trigger a shake animation to indicate incorrect attempt
    setShake(prev => prev + 1);
    return false;
  }, [guess, clue]);

  // Reveal a single incorrect letter (chosen at random)
  const revealLetter = useCallback(() => {
    if (status !== 'playing') return;
    const correctAnswer = clue.answer.toLowerCase();

    const wrongIndices = guess
      .map((char, i) => (char !== correctAnswer[i] ? i : -1))
      .filter((i) => i !== -1 && !revealed.includes(i));

    if (wrongIndices.length > 0) {
      const randomIndex = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
      const newGuess = [...guess];
      newGuess[randomIndex] = correctAnswer[randomIndex];
      setGuess(newGuess);
      setRevealed((prev) => (prev.includes(randomIndex) ? prev : [...prev, randomIndex]));

      if (newGuess.join('') === correctAnswer) setStatus('won');
    }
  }, [guess, clue, status, revealed]);

  // Enable a hint layer (indicator/fodder/definition)
  const toggleHint = useCallback((type: 'indicator' | 'fodder' | 'definition') => {
    setHints(prev => ({
      ...prev,
      [type === 'indicator' ? 'showIndicator' : type === 'fodder' ? 'showFodder' : 'showDefinition']: true
    }));
  }, []);

  return { guess, handleInput, handleBackspace, checkAnswer, revealLetter, toggleHint, hints, status, shake, revealed };
};
