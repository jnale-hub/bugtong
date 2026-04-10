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
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      className={`
      sm:px-8 px-6 py-2 min-w-24 border-[3px] sm:border-4  border-stone-900 rounded-full items-center justify-center active:translate-y-px active:translate-x-px transition-transform
      ${disabled ? "opacity-50" : color}
    `}
    >
      <Text className="text-2xl lowercase font-serif tracking-wide mb-1">
        {`${label} `}
      </Text>
    </Pressable>
  );
};

export default memo(ActionButton);
