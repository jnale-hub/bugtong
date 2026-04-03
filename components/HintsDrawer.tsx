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
      className={`
        w-full py-3 flex-row justify-between items-center group
        ${active ? "opacity-80" : ""}
      `}
    >
      <View className="relative">
        {/* Static Highlight */}
        {colorName && (
          <View
            className={`
              absolute inset-x-0 top-1/2 -translate-y-1/2 h-5
              ${colorName}
            `}
          />
        )}
        <Text className="relative font-bold text-xl lowercase font-sansita text-gray-900">
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
}

export default function HintsDrawer({
  onClose,
  hints,
  toggleHint,
  revealLetter,
}: Props) {
  const titleId = useId();

  return (
    <Modal
      transparent={true}
      visible={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1"
      >
        <Pressable
          onPress={() => {}} // prevent closing when clicking inside
          className="absolute bottom-0 w-full p-4"
        >
          <View className="bg-white rounded-2xl shadow-soft border-3 border-ink overflow-hidden p-6 pb-8">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-2">
              <Text id={titleId} className="font-light text-gray-900 text-lg">
                Select a hint
              </Text>
              <Pressable onPress={onClose} className="p-2 -mr-2">
                <Text className="text-gray-800 text-2xl font-bold">✕</Text>
              </Pressable>
            </View>

            {/* List */}
            <View className="flex-col sm:gap-1">
              <HintRow
                label="show indicators"
                colorName="bg-pastel-pink"
                active={hints.showIndicator}
                onClick={() => toggleHint("indicator")}
              />

              <HintRow
                label="show fodder"
                colorName="bg-pastel-yellow"
                active={hints.showFodder}
                onClick={() => toggleHint("fodder")}
              />

              <HintRow
                label="show definition"
                colorName="bg-pastel-blue"
                active={hints.showDefinition}
                onClick={() => toggleHint("definition")}
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
