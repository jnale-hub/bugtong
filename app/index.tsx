import ActionButton from "@/components/ActionButton";
import AnswerGrid from "@/components/AnswerGrid";
import ClueDisplay from "@/components/ClueDisplay";
import { EmojiGrid } from "@/components/EmojiGrid";
import HintsDrawer from "@/components/HintsDrawer";
import Keyboard from "@/components/Keyboard";
import { CLUES } from "@/data/clues";
import { useCrypticGame } from "@/hooks/useCrypticGame";
import { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeOut, SlideInDown } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function MinuteCrypticRefined() {
  const insets = useSafeAreaInsets();
  const [clueIndex, setClueIndex] = useState(0);
  const activeClue = CLUES[clueIndex];

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

  useEffect(() => {
    if (Platform.OS !== "web") {
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
    <SafeAreaView
      className="flex-1 bg-pastel-bg"
      edges={["top", "left", "right"]}
    >
      <EmojiGrid emoji="💭" />
      {/* Main scrollable content area */}
      <ScrollView className="flex-1 px-4">
        <View className="w-full flex-row justify-between items-center py-4 mb-2 max-w-2xl mx-auto">
          <View className="bg-ink px-4 py-1.5 border-2 shadow-soft rounded-2xl -rotate-1">
            <Text className="text-white font-bold text-lg font-mulish">
              Minute Cryptic
            </Text>
          </View>
          <Pressable
            onPress={() => setClueIndex((prev) => (prev + 1) % CLUES.length)}
            className="bg-white px-3 py-1.5 border-2 border-ink rounded-xl shadow-soft-sm active:translate-y-px active:shadow-none"
          >
            <Text className="text-xs font-bold text-ink">Next →</Text>
          </Pressable>
        </View>

        <View className="w-full max-w-2xl mx-auto">
          <ClueDisplay clue={activeClue} activeHints={hints} />
        </View>

        <View className="flex-col items-center w-full gap-y-8 max-w-2xl mx-auto">
          {/* Answer grid */}
          <AnswerGrid
            answer={activeClue.answer}
            guess={guess}
            status={status}
            shake={shake}
            revealed={revealed}
          />

          <View className="flex-row justify-center gap-3 w-full px-2">
            <ActionButton
              label="Hints"
              color="bg-pastel-yellow"
              onPress={() => setIsHintOpen(true)}
              disabled={status === "won"}
            />
            <ActionButton
              label="Check"
              color="bg-pastel-pink"
              onPress={checkAnswer}
              disabled={status === "won"}
            />
          </View>
        </View>

        {status === "won" && (
          <Animated.View
            entering={SlideInDown}
            exiting={FadeOut}
            className="w-full max-w-lg mx-auto bg-white border-2 border-ink p-4 shadow-soft rounded-2xl mt-6"
          >
            <View className="relative">
              <View className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-5 bg-pastel-pink" />
              <Text className="relative font-sansita font-bold text-xl mb-1">
                explanation
              </Text>
            </View>
            <Text className="text-sm leading-relaxed text-ink mt-2">
              {activeClue.definition.explanation}
            </Text>
          </Animated.View>
        )}
      </ScrollView>

      {/* Fixed bottom keyboard area */}
      <View
        className="w-full pb-2 px-1 pt-2 z-10 max-w-2xl mx-auto border-t-2 border-transparent"
        style={{ paddingBottom: Math.max(insets.bottom, 8) }}
      >
        <Keyboard onInput={handleInput} onBackspace={handleBackspace} />
      </View>

      {isHintOpen && (
        <HintsDrawer
          onClose={() => setIsHintOpen(false)}
          hints={hints}
          toggleHint={toggleHint}
          revealLetter={revealLetter}
        />
      )}
    </SafeAreaView>
  );
}
