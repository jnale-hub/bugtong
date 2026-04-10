import { ReactNode } from "react";
import { View } from "react-native";

type SectionCardProps = {
  children: ReactNode;
  className?: string;
};

export default function SectionCard({
  children,
  className = "",
}: SectionCardProps) {
  return (
    <View
      className={`border-lg rounded-xl bg-stone-50 p-4 ${className}`}
    >
      {children}
    </View>
  );
}
