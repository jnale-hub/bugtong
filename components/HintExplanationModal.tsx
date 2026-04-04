import { Modal, Pressable, Text, View } from "react-native";

type HintExplanationModalProps = {
  visible: boolean;
  title: string;
  body: string;
  onClose: () => void;
};

export default function HintExplanationModal({
  visible,
  title,
  body,
  onClose,
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
          <View className="bg-white rounded-2xl shadow-soft border-[3px] border-ink overflow-hidden p-6 pb-8 max-w-md mx-auto w-full">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-light text-gray-900 text-lg">{title}</Text>
              <Pressable
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Close explanation"
                className="p-2 -mr-2"
              >
                <Text className="text-gray-800 text-2xl font-bold">x</Text>
              </Pressable>
            </View>
            <Text className="text-sm leading-relaxed text-ink mt-2">
              {body}
            </Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
