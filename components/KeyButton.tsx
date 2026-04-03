import { Pressable, Text } from "react-native";

type KeyButtonProps = {
  char: string;
  onClickAction: () => void;
};

export default function KeyButton({ char, onClickAction }: KeyButtonProps) {
  const buttonClass =
    "flex-1 h-10 sm:h-12 flex items-center justify-center pb-1 bg-white rounded active:translate-y-0.5 active:shadow-none transition-all shadow-sm";
  const textClass = "text-lg sm:text-xl text-ink uppercase";

  return (
    <Pressable onPress={onClickAction} className={buttonClass}>
      <Text className={textClass}>{char}</Text>
    </Pressable>
  );
}
