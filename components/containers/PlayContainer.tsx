import PlayView from "@/components/ui/PlayView";
import { useCrypticGame } from "@/hooks/useCrypticGame";
import { useDailyClue } from "@/hooks/useDailyClue";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PlayContainer() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { clue: activeClue, loading, error } = useDailyClue();
  const {
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
  } = useCrypticGame(activeClue);
  const [isHintOpen, setIsHintOpen] = useState(false);

  const dateLabel = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const key = event.key.toLowerCase();

      if (/^[a-z]$/.test(key)) {
        event.preventDefault();
        handleInput(key);
        return;
      }

      if (key === "backspace") {
        event.preventDefault();
        handleBackspace();
        return;
      }

      if (key === "enter") {
        event.preventDefault();
        checkAnswer();
      }
    };

    (window as any).addEventListener("keydown", handleKeyDown);

    return () => {
      (window as any).removeEventListener("keydown", handleKeyDown);
    };
  }, [handleInput, handleBackspace, checkAnswer]);

  return (
    <PlayView
      activeClue={activeClue}
      loading={loading}
      error={error}
      dateLabel={dateLabel}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      hints={hints}
      status={status}
      guess={guess}
      shake={shake}
      revealed={revealed}
      isHintOpen={isHintOpen}
      onOpenHints={() => setIsHintOpen(true)}
      onCloseHints={() => setIsHintOpen(false)}
      onInput={handleInput}
      onBackspace={handleBackspace}
      onCheck={checkAnswer}
      onToggleHint={toggleHint}
      onRevealLetter={revealLetter}
      bottomInset={Math.max(insets.bottom, 8)}
    />
  );
}
