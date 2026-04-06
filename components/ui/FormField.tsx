import { ReactNode } from "react";
import { Text, View } from "react-native";

type FormFieldProps = {
  label: string;
  children: ReactNode;
};

export default function FormField({ label, children }: FormFieldProps) {
  return (
    <View className="gap-2">
      <Text className=" text-sm/70">{label}</Text>
      {children}
    </View>
  );
}
