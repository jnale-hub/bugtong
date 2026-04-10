import { Feather } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";

type HintExplanationModalProps = {
  visible: boolean;
  title: string;
  body: string;
  onClose: () => void;
  onBack?: () => void;
};

export default function HintExplanationModal({
  visible,
  title,
  body,
  onClose,
  onBack,
}: HintExplanationModalProps) {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close explanation"
        className="flex-1"
      >
        <Pressable
          onPress={() => {}}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          className="absolute top-1/2 w-full p-4"
        >
          <View className="bg-stone-50 rounded-2xl border-sm overflow-hidden py-4 px-6 pb-6 max-w-md mx-auto w-full">
            <View className="items-center justify-between flex-row mb-2">
              {onBack ? (
                <Pressable
                  onPress={onBack}
                  accessibilityRole="button"
                  accessibilityLabel="Back to hints"
                  className="p-2 -ml-2"
                >
                  <Feather name="arrow-left" size={28} color="#2D2D2D" />
                </Pressable>
              ) : (
                <View className="w-10" />
              )}
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close explanation"
                className="p-2 -mr-2"
              >
                <Text className="text-stone-800 text-2xl font-bold">✕</Text>
              </Pressable>
            </View>
            <Text className="body-base text-lg">{body}</Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
