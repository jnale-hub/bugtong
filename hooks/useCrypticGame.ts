import { ClueData } from "@/data/clues";
import { useCallback, useEffect, useState } from "react";

export type GameStatus = "playing" | "won";

const getAnswerLength = (answer: string) => {
  return answer.replace(/[^A-Za-z]/g, "").length;
};

export const useCrypticGame = (clue: ClueData | null) => {
  const totalLength = clue ? getAnswerLength(clue.answer) : 0;

  const [guess, setGuess] = useState<string[]>(Array(totalLength).fill(""));
  const [status, setStatus] = useState<GameStatus>("playing");
  const [shake, setShake] = useState(0);

  const [revealed, setRevealed] = useState<number[]>([]);

  const [hints, setHints] = useState({
    showIndicator: false,
    showFodder: false,
    showDefinition: false,
  });

  useEffect(() => {
    if (!clue) return;
    const len = getAnswerLength(clue.answer);
    // Defer state updates to avoid synchronous setState inside an effect (prevents cascading renders)
    Promise.resolve().then(() => {
      setGuess(Array(len).fill(""));
      setStatus("playing");
      setHints({
        showIndicator: false,
        showFodder: false,
        showDefinition: false,
      });
      setRevealed([]);
    });
  }, [clue]);

  const handleInput = useCallback(
    (char: string) => {
      if (status !== "playing") return;
      const firstEmpty = guess.findIndex((l) => l === "");
      if (firstEmpty !== -1) {
        const newGuess = [...guess];
        newGuess[firstEmpty] = char.toLowerCase();
        setGuess(newGuess);
      }
    },
    [guess, status],
  );

  const handleBackspace = useCallback(() => {
    if (status !== "playing") return;
    const revealedSet = new Set(revealed);
    const lastFilled = guess
      .map((_, i) => i)
      .reverse()
      .find((i) => guess[i] !== "" && !revealedSet.has(i));

    if (lastFilled !== undefined) {
      const newGuess = [...guess];
      newGuess[lastFilled] = "";
      setGuess(newGuess);
    }
  }, [guess, status, revealed]);

  const checkAnswer = useCallback(() => {
    if (!clue) return false;
    const currentGuess = guess.join("").toLowerCase();
    const correctAnswer = clue.answer.replace(/[^A-Za-z]/g, "").toLowerCase();

    if (currentGuess === correctAnswer) {
      setStatus("won");
      return true;
    }
    setShake((prev) => prev + 1);
    return false;
  }, [guess, clue]);

  const revealLetter = useCallback(() => {
    if (status !== "playing" || !clue) return;
    const correctAnswer = clue.answer.replace(/[^A-Za-z]/g, "").toLowerCase();

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
  }, [guess, clue, status, revealed]);

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
  };
};
