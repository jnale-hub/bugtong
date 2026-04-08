import ActionButton from "@/components/ActionButton";
import AnswerGrid from "@/components/AnswerGrid";
import ClueDisplay from "@/components/ClueDisplay";
import HintExplanationModal from "@/components/HintExplanationModal";
import HintsDrawer from "@/components/HintsDrawer";
import Keyboard from "@/components/Keyboard";
import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";
import SectionCard from "@/components/ui/SectionCard";
import { ClueData } from "@/data/clues";
import { GameStatus } from "@/hooks/useCrypticGame";
import { Feather } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Platform, Pressable, Text, View } from "react-native";
import { PIConfetti, PIConfettiMethods } from "react-native-fast-confetti";
import Animated, { FadeOut, SlideInDown } from "react-native-reanimated";

type HintState = {
  showIndicator: boolean;
  showFodder: boolean;
  showDefinition: boolean;
};

type PlayViewProps = {
  activeClue: ClueData | null;
  loading: boolean;
  error: string | null;
  dateLabel: string;
  onBack: () => void;
  hints: HintState;
  status: GameStatus;
  guess: string[];
  shake: number;
  revealed: number[];
  isHintOpen: boolean;
  onOpenHints: () => void;
  onCloseHints: () => void;
  onInput: (char: string) => void;
  onBackspace: () => void;
  onCheck: () => void;
  onToggleHint: (type: "indicator" | "fodder" | "definition") => void;
  onRevealLetter: () => void;
  bottomInset: number;
};

export default function PlayView({
  activeClue,
  loading,
  error,
  dateLabel,
  onBack,
  hints,
  status,
  guess,
  shake,
  revealed,
  isHintOpen,
  onOpenHints,
  onCloseHints,
  onInput,
  onBackspace,
  onCheck,
  onToggleHint,
  onRevealLetter,
  bottomInset,
}: PlayViewProps) {
  const [hintExplanation, setHintExplanation] = useState<{
    title: string;
    body: string;
  } | null>(null);

  const explanationText = {
    indicator: activeClue?.indicator?.explanation,
    fodder: activeClue?.fodder?.explanation,
    definition: activeClue?.definition?.explanation,
    letter: "A letter has been revealed.",
  };

  const confettiRef = useRef<PIConfettiMethods>(null);

  useEffect(() => {
    if (status === "won") {
      if (Platform.OS === "web") {
        import("canvas-confetti").then((module) => {
          const confetti = module.default;
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.2 },
          });
        });
      } else {
        confettiRef.current?.restart();
      }
    }
  }, [status]);

  const { width } = Dimensions.get("window");

  return (
    <PageShell
      maxWidthClassName="max-w-2xl"
      footer={
        status !== "won" && activeClue ? (
          <View
            className="w-full max-w-2xl mx-auto"
            style={{ paddingBottom: bottomInset }}
          >
            <Keyboard onInput={onInput} onBackspace={onBackspace} />
          </View>
        ) : null
      }
    >
      {error || (!activeClue && !loading) ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-xl font-bold">
            {error || "No clue available today!"}
          </Text>
        </View>
      ) : (
        <>
          <PageHeader
            left={
              <View className="flex-row items-center gap-1 justify-center">
                <Pressable
                  onPress={onBack}
                  accessibilityRole="button"
                  accessibilityLabel="Back"
                >
                  <Feather name="arrow-left" size={20} className="font-bold" />
                </Pressable>
                <Text className="font-semibold">{dateLabel}</Text>
              </View>
            }
            right={
              <Text className="font-serif text-lg font-bold">Bugtong 🇵🇭</Text>
            }
          />

          <View className="mt-2 sm:mx-8">
            <ClueDisplay
              clue={activeClue}
              loading={loading}
              activeHints={hints}
              onExplain={(title, body) => setHintExplanation({ title, body })}
              isSolved={status === "won"}
            />
          </View>

          {activeClue ? (
            <>
              <View className="flex-col items-center w-full gap-y-8">
                <AnswerGrid
                  answer={activeClue.answer}
                  guess={guess}
                  status={status}
                  shake={shake}
                  revealed={revealed}
                />

                {status !== "won" ? (
                  <View className="flex-row justify-center gap-3 w-full px-2">
                    <ActionButton
                      label="Hints"
                      color="bg-yellow-300"
                      onPress={onOpenHints}
                    />
                    <ActionButton
                      label="Check"
                      color="bg-green-300"
                      onPress={onCheck}
                    />
                  </View>
                ) : null}
              </View>

              {status === "won" ? (
                <Animated.View entering={SlideInDown} exiting={FadeOut}>
                  <SectionCard className="mt-6 max-w-lg w-full mx-auto">
                    <Text className="font-serif font-bold text-xl">
                      Explanation
                    </Text>
                    <View className="mt-4 gap-4">
                      <View className="gap-1">
                        <Text className=" text-xs uppercase tracking-wide/70">
                          Definition
                        </Text>
                        <Text className="text-sm leading-relaxed">
                          {activeClue.definition.explanation}
                        </Text>
                      </View>
                      {activeClue.indicator?.explanation ? (
                        <View className="gap-1">
                          <Text className=" text-xs uppercase tracking-wide/70">
                            Indicator
                          </Text>
                          <Text className="text-sm leading-relaxed">
                            {activeClue.indicator.explanation}
                          </Text>
                        </View>
                      ) : null}
                      {activeClue.fodder?.explanation ? (
                        <View className="gap-1">
                          <Text className=" text-xs uppercase tracking-wide/70">
                            Fodder
                          </Text>
                          <Text className="text-sm leading-relaxed">
                            {activeClue.fodder.explanation}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </SectionCard>
                </Animated.View>
              ) : null}

              {isHintOpen ? (
                <HintsDrawer
                  onClose={onCloseHints}
                  hints={hints}
                  toggleHint={onToggleHint}
                  revealLetter={onRevealLetter}
                  explanations={explanationText}
                  onExplain={(title, body) =>
                    setHintExplanation({ title, body })
                  }
                />
              ) : null}
            </>
          ) : null}
        </>
      )}

      {hintExplanation ? (
        <HintExplanationModal
          visible={true}
          title={hintExplanation.title}
          body={hintExplanation.body}
          onClose={() => setHintExplanation(null)}
          onBack={() => {
            setHintExplanation(null);
            onOpenHints();
          }}
        />
      ) : null}

      {status === "won" && Platform.OS !== "web" && (
        <View
          className="absolute top-0 left-0 right-0 z-50"
          pointerEvents="none"
        >
          <PIConfetti
            ref={confettiRef}
            count={200}
            blastPosition={{ x: width / 2, y: -20 }}
          />
        </View>
      )}
    </PageShell>
  );
}
