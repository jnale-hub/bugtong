import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type SelectionChipsProps = {
  selections: { start: number; end: number; text: string }[];
  onRemove: (index: number) => void;
  emptyText?: string;
};

export default function SelectionChips({
  selections,
  onRemove,
  emptyText = "No text selected yet.",
}: SelectionChipsProps) {
  if (!selections.length) {
    return <Text className="font-mulish text-sm text-ink/60">{emptyText}</Text>;
  }

  return (
    <View className="flex-row flex-wrap gap-2">
      {selections.map((selection, index) => (
        <View
          key={`${selection.start}-${selection.end}-${index}`}
          className="flex-row items-center px-3 py-1 border-2 border-ink rounded-full bg-white"
        >
          <Text className="font-mulish text-sm text-ink">{selection.text}</Text>
          <Pressable
            onPress={() => onRemove(index)}
            className="ml-2 h-5 w-5 items-center justify-center rounded-full border border-ink/20 bg-ink/5"
          >
            <Feather name="x" size={12} color="#1f1f1f" />
          </Pressable>
        </View>
      ))}
    </View>
  );
}
