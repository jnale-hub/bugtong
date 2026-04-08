import { useId } from "react";
import { Modal, Pressable, Text, View } from "react-native";

interface HintRowProps {
  label: string;
  onClick?: () => void;
  colorName?: string;
}

function HintRow({ label, onClick, colorName }: HintRowProps) {
  return (
    <Pressable
      onPress={onClick}
      accessibilityRole="button"
      accessibilityLabel={label}
      className="w-full py-3 flex-row justify-between items-center group"
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
        <Text className="relative font-bold text-xl lowercase font-serif text-stone-900">
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

interface Props {
  onClose: () => void;
  toggleHint: (type: "indicator" | "fodder" | "definition") => void;
  revealLetter: () => void;
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
  onExplain,
  explanations,
}: Props) {
  const titleId = useId();

  const hintOptions = [
    {
      key: "indicator",
      label: "show indicators",
      colorName: "bg-rose-300/80",
      title: "Indicator",
      fallback: "No indicator explanation provided.",
    },
    {
      key: "fodder",
      label: "show fodder",
      colorName: "bg-yellow-300/80",
      title: "Fodder",
      fallback: "No fodder explanation provided.",
    },
    {
      key: "definition",
      label: "show definition",
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
          className="absolute bottom-0 w-full p-4"
        >
          <View className="bg-stone-50 rounded-2xl shadow-soft border-[3px] border-stone-900 overflow-hidden p-6 pb-8 max-w-2xl mx-auto w-full">
            <View className="flex-row justify-between items-center mb-2">
              <Text id={titleId} className="font-light text-stone-900 text-lg">
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
              {hintOptions.map(({ key, label, colorName, title, fallback }) => {
                const explanation = explanations[key];
                if (!explanation) return null;

                return (
                  <HintRow
                    key={key}
                    label={label}
                    colorName={colorName}
                    onClick={() => {
                      toggleHint(key);
                      onClose();
                      onExplain(title, explanation || fallback);
                    }}
                  />
                );
              })}

              <View className="h-2 sm:h-4" />

              <HintRow
                label="show letter"
                onClick={() => {
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
