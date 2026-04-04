import { ReactNode } from "react";
import { Text, View } from "react-native";

type FormFieldProps = {
  label: string;
  children: ReactNode;
};

export default function FormField({ label, children }: FormFieldProps) {
  return (
    <View className="gap-2">
      <Text className="font-mulish text-sm text-ink/70">{label}</Text>
      {children}
    </View>
  );
}
