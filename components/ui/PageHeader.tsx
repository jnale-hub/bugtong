import { ReactNode } from "react";
import { Text, View } from "react-native";

type PageHeaderProps = {
  title?: string;
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
};

export default function PageHeader({
  title,
  left,
  center,
  right,
}: PageHeaderProps) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-1 items-start">
        {left ? (
          left
        ) : title ? (
          <View className="bg-ink px-4 py-1.5 border-2 shadow-soft rounded-2xl -rotate-1">
            <Text className="text-white font-bold text-lg font-serif">
              {title}
            </Text>
          </View>
        ) : null}
      </View>
      <View className="flex-1 items-center">{center ? center : null}</View>
      <View className="flex-1 items-end">{right ? right : null}</View>
    </View>
  );
}
