import { memo } from "react";
import { Pressable, Text } from "react-native";

interface ActionButtonProps {
  label: string;
  color?: string;
  onPress?: () => void;
  disabled?: boolean;
}

const ActionButton = ({
  label,
  color = "",
  onPress,
  disabled = false,
}: ActionButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      className={`
      sm:px-8 px-4 py-2 border-[3px] border-ink rounded-full shadow-soft-sm items-center justify-center
      active:translate-y-px active:shadow-none transition-all 
      ${disabled ? "opacity-50" : color}
    `}
    >
      <Text className="font-extrabold text-lg sm:text-xl lowercase font-serif">
        {label}
      </Text>
    </Pressable>
  );
};

export default memo(ActionButton);
