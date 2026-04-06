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
      className={`border-4 border-stone-900 rounded-xl bg-stone-50/90 shadow-soft p-4 ${className}`}
    >
      {children}
    </View>
  );
}
