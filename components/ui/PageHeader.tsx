import { ReactNode } from "react";
import { View } from "react-native";

type PageHeaderProps = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
};

export default function PageHeader({
  left,
  center,
  right,
}: PageHeaderProps) {
  if (!left && !center && !right) {
    return null;
  }

  return (
    <View className="flex-row items-center justify-between py-2">
      {left && <View className="flex-1 items-start">{left}</View>}
      {center && <View className="flex-1 items-center">{center}</View>}
      {right && <View className="items-end">{right}</View>}
    </View>
  );
}
