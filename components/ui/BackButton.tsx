import { Feather } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

type BackButtonProps = {
  onPress: () => void;
};

export default function BackButton({ onPress }: BackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Back"
      className="flex-row items-center gap-1"
    >
      <Feather name="chevron-left" size={18} color="#1f1f1f" />
      <Text className="text-sm">Back</Text>
    </Pressable>
  );
}
