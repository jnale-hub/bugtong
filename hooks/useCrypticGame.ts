import { ClueData } from "@/data/clues";
import { useCallback, useEffect, useMemo, useState } from "react";

export type GameStatus = "playing" | "won";
export const MAX_REVEAL_LETTER_HINTS = 3;

const getAnswerLength = (answer: string) => {
  return answer.replace(/[^A-Za-z]/g, "").length;
};

export const useCrypticGame = (
  clue: ClueData | null,
  initialStatus: GameStatus = "playing",
) => {
  const totalLength = clue ? getAnswerLength(clue.answer) : 0;

  const correctAnswer = useMemo(() => {
    return clue ? clue.answer.replace(/[^A-Za-z]/g, "").toLowerCase() : "";
  }, [clue]);

  const [guess, setGuess] = useState<string[]>(Array(totalLength).fill(""));
  const [status, setStatus] = useState<GameStatus>("playing");
  const [shake, setShake] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const [revealed, setRevealed] = useState<number[]>([]);

  const [hints, setHints] = useState({
    showIndicator: false,
    showFodder: false,
    showDefinition: false,
  });

  useEffect(() => {
    if (!clue) return;
    const len = getAnswerLength(clue.answer);
    const solvedGuess = clue.answer
      .replace(/[^A-Za-z]/g, "")
      .toLowerCase()
      .split("");
    // Defer state updates to avoid synchronous setState inside an effect (prevents cascading renders)
    Promise.resolve().then(() => {
      setGuess(initialStatus === "won" ? solvedGuess : Array(len).fill(""));
      setStatus(initialStatus);
      setHints({
        showIndicator: false,
        showFodder: false,
        showDefinition: false,
      });
      setRevealed([]);
      setActiveIndex(0);
    });
  }, [clue, initialStatus]);

  const handleInput = useCallback(
    (char: string) => {
      if (status !== "playing") return;

      const newGuess = [...guess];
      const revealedSet = new Set(revealed);

      // Insert at activeIndex if it's not revealed
      if (!revealedSet.has(activeIndex)) {
        newGuess[activeIndex] = char.toLowerCase();
        setGuess(newGuess);
      }

      const len = newGuess.length;

      const findNextEmpty = (start: number, end: number) => {
        for (let i = start; i < end; i++) {
          if (!revealedSet.has(i) && newGuess[i] === "") return i;
        }
        return -1;
      };

      // Look for the next empty cell
      let foundIndex = findNextEmpty(activeIndex + 1, len);

      // Loop back to the beginning if we hit the end
      if (foundIndex === -1) {
        foundIndex = findNextEmpty(0, activeIndex);
      }

      if (foundIndex !== -1) {
        setActiveIndex(foundIndex);
      } else {
        // If everything is completely filled, advance to next or stay at end
        setActiveIndex(activeIndex + 1 < len ? activeIndex + 1 : len - 1);
      }
    },
    [guess, status, activeIndex, revealed],
  );

  const handleBackspace = useCallback(() => {
    if (status !== "playing") return;
    const revealedSet = new Set(revealed);

    // If the current cell is not empty, clear it.
    if (guess[activeIndex] !== "" && !revealedSet.has(activeIndex)) {
      const newGuess = [...guess];
      newGuess[activeIndex] = "";
      setGuess(newGuess);
    } else {
      // Find the first unfilled, unrevealed cell backwards to jump to
      let prevIndex = activeIndex - 1;
      while (prevIndex >= 0 && revealedSet.has(prevIndex)) {
        prevIndex--;
      }

      if (prevIndex >= 0) {
        const newGuess = [...guess];
        newGuess[prevIndex] = "";
        setGuess(newGuess);
        setActiveIndex(prevIndex);
      }
    }
  }, [guess, status, activeIndex, revealed]);

  const checkAnswer = useCallback(() => {
    if (!clue || !correctAnswer) return false;
    const currentGuess = guess.join("").toLowerCase();

    if (currentGuess === correctAnswer) {
      setStatus("won");
      return true;
    }
    setShake((prev) => prev + 1);
    return false;
  }, [guess, clue, correctAnswer]);

  const revealLetter = useCallback(() => {
    if (status !== "playing" || !clue || !correctAnswer) return;
    if (revealed.length >= MAX_REVEAL_LETTER_HINTS) return;

    const wrongIndices = guess
      .map((char, i) => (char !== correctAnswer[i] ? i : -1))
      .filter((i) => i !== -1 && !revealed.includes(i));

    if (wrongIndices.length > 0) {
      const randomIndex =
        wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
      const newGuess = [...guess];
      newGuess[randomIndex] = correctAnswer[randomIndex];
      setGuess(newGuess);
      setRevealed((prev) =>
        prev.includes(randomIndex) ? prev : [...prev, randomIndex],
      );

      if (newGuess.join("") === correctAnswer) setStatus("won");
    }
  }, [guess, clue, status, revealed, correctAnswer]);

  const toggleHint = useCallback(
    (type: "indicator" | "fodder" | "definition") => {
      setHints((prev) => ({
        ...prev,
        [type === "indicator"
          ? "showIndicator"
          : type === "fodder"
            ? "showFodder"
            : "showDefinition"]: true,
      }));
    },
    [],
  );

  return {
    guess,
    handleInput,
    handleBackspace,
    checkAnswer,
    revealLetter,
    toggleHint,
    hints,
    status,
    shake,
    revealed,
    revealLetterHintsUsed: revealed.length,
    revealLetterHintsRemaining: Math.max(
      MAX_REVEAL_LETTER_HINTS - revealed.length,
      0,
    ),
    maxRevealLetterHints: MAX_REVEAL_LETTER_HINTS,
    activeIndex,
    setActiveIndex,
  };
};
