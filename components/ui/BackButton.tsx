import { Feather } from "@expo/vector-icons";
import { Text, Pressable } from "react-native";

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
      <Feather name="arrow-left" size={28} className="font-bold" />
      <Text className="text-lg font-sans-semibold">Back</Text>
    </Pressable>
  );
}
