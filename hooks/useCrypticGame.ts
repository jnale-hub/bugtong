import { ClueData } from "@/data/clues";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

  // Use refs to store current state for use in stable callbacks
  const stateRef = useRef({
    guess,
    status,
    activeIndex,
    revealed,
  });

  useEffect(() => {
    stateRef.current = { guess, status, activeIndex, revealed };
  }, [guess, status, activeIndex, revealed]);

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

  const handleInput = useCallback((char: string) => {
    const {
      guess: currentGuess,
      status: currentStatus,
      activeIndex: currentActiveIndex,
      revealed: currentRevealed,
    } = stateRef.current;

    if (currentStatus !== "playing") return;

    const newGuess = [...currentGuess];
    const revealedSet = new Set(currentRevealed);

    // Insert at activeIndex if it's not revealed
    if (!revealedSet.has(currentActiveIndex)) {
      newGuess[currentActiveIndex] = char.toLowerCase();
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
    let foundIndex = findNextEmpty(currentActiveIndex + 1, len);

    // Loop back to the beginning if we hit the end
    if (foundIndex === -1) {
      foundIndex = findNextEmpty(0, currentActiveIndex);
    }

    if (foundIndex !== -1) {
      setActiveIndex(foundIndex);
    } else {
      // If everything is completely filled, advance to next or stay at end
      setActiveIndex(
        currentActiveIndex + 1 < len ? currentActiveIndex + 1 : len - 1,
      );
    }
  }, []);

  const handleBackspace = useCallback(() => {
    const {
      guess: currentGuess,
      status: currentStatus,
      activeIndex: currentActiveIndex,
      revealed: currentRevealed,
    } = stateRef.current;

    if (currentStatus !== "playing") return;
    const revealedSet = new Set(currentRevealed);

    // If the current cell is not empty, clear it.
    if (
      currentGuess[currentActiveIndex] !== "" &&
      !revealedSet.has(currentActiveIndex)
    ) {
      const newGuess = [...currentGuess];
      newGuess[currentActiveIndex] = "";
      setGuess(newGuess);
    } else {
      // Find the first unfilled, unrevealed cell backwards to jump to
      let prevIndex = currentActiveIndex - 1;
      while (prevIndex >= 0 && revealedSet.has(prevIndex)) {
        prevIndex--;
      }

      if (prevIndex >= 0) {
        const newGuess = [...currentGuess];
        newGuess[prevIndex] = "";
        setGuess(newGuess);
        setActiveIndex(prevIndex);
      }
    }
  }, []);

  const checkAnswer = useCallback(() => {
    if (!clue || !correctAnswer) return false;
    const { guess: currentGuess } = stateRef.current;
    const currentGuessStr = currentGuess.join("").toLowerCase();

    if (currentGuessStr === correctAnswer) {
      setStatus("won");
      return true;
    }
    setShake((prev) => prev + 1);
    return false;
  }, [clue, correctAnswer]);

  const revealLetter = useCallback(() => {
    const {
      guess: currentGuess,
      status: currentStatus,
      revealed: currentRevealed,
    } = stateRef.current;

    if (currentStatus !== "playing" || !clue || !correctAnswer) return;
    if (currentRevealed.length >= MAX_REVEAL_LETTER_HINTS) return;

    const wrongIndices = currentGuess
      .map((char, i) => (char !== correctAnswer[i] ? i : -1))
      .filter((i) => i !== -1 && !currentRevealed.includes(i));

    if (wrongIndices.length > 0) {
      const randomIndex =
        wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
      const newGuess = [...currentGuess];
      newGuess[randomIndex] = correctAnswer[randomIndex];
      setGuess(newGuess);
      setRevealed((prev) =>
        prev.includes(randomIndex) ? prev : [...prev, randomIndex],
      );

      if (newGuess.join("") === correctAnswer) setStatus("won");
    }
  }, [clue, correctAnswer]);

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
