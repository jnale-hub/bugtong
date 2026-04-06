import { useId } from "react";
import { Modal, Pressable, Text, View } from "react-native";

type HintState = {
  showIndicator: boolean;
  showFodder: boolean;
  showDefinition: boolean;
};

interface HintRowProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  colorName?: string;
}

function HintRow({ label, active = false, onClick, colorName }: HintRowProps) {
  return (
    <Pressable
      onPress={onClick}
      disabled={active}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: active }}
      className={`
        w-full py-3 flex-row justify-between items-center group
        ${active ? "opacity-80" : ""}
      `}
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
        <Text className="relative font-bold text-xl lowercase font-serif text-gray-900">
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

interface Props {
  onClose: () => void;
  hints: HintState;
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
  hints,
  toggleHint,
  revealLetter,
  onExplain,
  explanations,
}: Props) {
  const titleId = useId();

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
              <Text id={titleId} className="font-light text-gray-900 text-lg">
                Select a hint
              </Text>
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close hints"
                className="p-2 -mr-2"
              >
                <Text className="text-gray-800 text-2xl font-bold">✕</Text>
              </Pressable>
            </View>

            <View className="flex-col sm:gap-1">
              <HintRow
                label="show indicators"
                colorName="bg-rose-300"
                active={hints.showIndicator}
                onClick={() => {
                  toggleHint("indicator");
                  onClose();
                  onExplain(
                    "Indicator",
                    explanations.indicator ||
                      "No indicator explanation provided.",
                  );
                }}
              />

              <HintRow
                label="show fodder"
                colorName="bg-yellow-300/80"
                active={hints.showFodder}
                onClick={() => {
                  toggleHint("fodder");
                  onClose();
                  onExplain(
                    "Fodder",
                    explanations.fodder || "No fodder explanation provided.",
                  );
                }}
              />

              <HintRow
                label="show definition"
                colorName="bg-blue-300/80"
                active={hints.showDefinition}
                onClick={() => {
                  toggleHint("definition");
                  onClose();
                  onExplain(
                    "Definition",
                    explanations.definition ||
                      "No definition explanation provided.",
                  );
                }}
              />

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
