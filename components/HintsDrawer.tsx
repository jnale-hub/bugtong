import { useId } from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface HintRowProps {
  label: string;
  onClick?: () => void;
  colorName?: string;
  disabled?: boolean;
  rightText?: string;
}

function HintRow({
  label,
  onClick,
  colorName,
  disabled,
  rightText,
}: HintRowProps) {
  return (
    <Pressable onPress={onClick} disabled={disabled}>
      <View
        accessibilityRole="button"
        accessibilityLabel={label}
        className={`w-full py-3 flex-row justify-between items-center group ${disabled ? "opacity-40" : ""}`}
      >
        <View className="relative">
          {colorName && (
            <View
              className={`
                absolute inset-x-0 top-1/2 -translate-y-1/2 h-5
                ${colorName}
              `}
            />
          )}
          <Text className="relative text-2xl lowercase font-serif text-stone-900">
            {`${label} `}
          </Text>
        </View>

        {rightText ? (
          <Text className="body-muted text-sm">{rightText}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

interface Props {
  onClose: () => void;
  toggleHint: (type: "indicator" | "fodder" | "definition") => void;
  revealLetter: () => void;
  revealLetterHintsUsed: number;
  revealLetterHintsRemaining: number;
  maxRevealLetterHints: number;
  onExplain: (title: string, body: string) => void;
  explanations: {
    indicator?: string;
    fodder?: string;
    definition?: string;
    letter?: string;
  };
}

export default function HintsDrawer({
  onClose,
  toggleHint,
  revealLetter,
  revealLetterHintsUsed,
  revealLetterHintsRemaining,
  maxRevealLetterHints,
  onExplain,
  explanations,
}: Props) {
  const titleId = useId();

  const hintOptions = [
    {
      key: "indicator",
      label: "show indicators",
      rightText: "Tanda",
      colorName: "bg-rose-300/80",
      title: "Indicator",
      fallback: "No indicator explanation provided.",
    },
    {
      key: "fodder",
      label: "show fodder",
      rightText: "Sangkap",
      colorName: "bg-yellow-300/80",
      title: "Fodder",
      fallback: "No fodder explanation provided.",
    },
    {
      key: "definition",
      label: "show definition",
      rightText: "Kahulugan",
      colorName: "bg-blue-300/80",
      title: "Definition",
      fallback: "No definition explanation provided.",
    },
  ] as const;

  return (
    <Modal
      transparent={true}
      visible={true}
      animationType="slide"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close hints"
        className="flex-1"
      >
        <Pressable
          onPress={() => {}}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          className="absolute bottom-4 w-full p-4"
        >
          <View className="bg-stone-50 rounded-2xl border-sm overflow-hidden p-6 pb-8 max-w-2xl mx-auto w-full">
            <View className="flex-row justify-between items-center mb-2">
              <Text id={titleId} className="body-muted text-lg">
                Select a hint
              </Text>
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close hints"
                className="p-2 -mr-2"
              >
                <Text className="text-stone-800 text-2xl font-bold">✕</Text>
              </Pressable>
            </View>

            <View className="flex-col sm:gap-1">
              {hintOptions.map(
                ({ key, label, rightText, colorName, title, fallback }) => {
                  const explanation = explanations[key];
                  if (!explanation) return null;

                  return (
                    <HintRow
                      key={key}
                      label={label}
                      rightText={rightText}
                      colorName={colorName}
                      onClick={() => {
                        toggleHint(key);
                        onClose();
                        onExplain(title, explanation || fallback);
                      }}
                    />
                  );
                },
              )}

              <View className="h-2 sm:h-4" />

              <HintRow
                label="show letter"
                rightText={`${revealLetterHintsUsed}/${maxRevealLetterHints}`}
                disabled={revealLetterHintsRemaining <= 0}
                onClick={() => {
                  if (revealLetterHintsRemaining <= 0) return;
                  revealLetter();
                  onClose();
                }}
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
