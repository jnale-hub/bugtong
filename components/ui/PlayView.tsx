import ActionButton from "@/components/ActionButton";
import AnswerGrid from "@/components/AnswerGrid";
import ClueDisplay from "@/components/ClueDisplay";
import HintExplanationModal from "@/components/HintExplanationModal";
import HintsDrawer from "@/components/HintsDrawer";
import Keyboard from "@/components/Keyboard";
import WonExplanation from "@/components/WonExplanation";
import Logo from "@/components/ui/Logo";
import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";
import { ClueData } from "@/data/clues";
import { GameStatus } from "@/hooks/useCrypticGame";
import { Feather } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Text,  Dimensions, Platform, Pressable, View } from "react-native";
import { PIConfetti, PIConfettiMethods } from "react-native-fast-confetti";

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
  activeIndex: number;
  onSelectIndex: (index: number) => void;
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
  activeIndex,
  onSelectIndex,
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
                  <Feather name="arrow-left" size={28} className="font-bold" />
                </Pressable>
                <Text className="font-sans-semibold xs:text-lg">{dateLabel}</Text>
              </View>
            }
            right={<Logo />}
          />

          <View className="mt-8 sm:mx-8">
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
                  activeIndex={activeIndex}
                  onSelectIndex={onSelectIndex}
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
                      disabled={guess.includes("")}
                    />
                  </View>
                ) : null}
              </View>

              {status === "won" ? <WonExplanation clue={activeClue} /> : null}

              {isHintOpen ? (
                <HintsDrawer
                  onClose={onCloseHints}
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
