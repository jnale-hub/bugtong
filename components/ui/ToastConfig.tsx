import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { BaseToastProps } from "react-native-toast-message";

export const toastConfig = {
  success: ({ text1, text2 }: BaseToastProps) => (
    <View className="max-w-lg flex-row items-center w-[90%] bg-emerald-200 border-sm rounded-2xl p-4 justify-center gap-4">
      <Feather name="check-circle" size={32} color="#1c1917" />
      <View className="flex-col flex-1">
        {text1 ? (
          <Text className="font-serif tracking-wide text-xl text-stone-900">
            {text1}
          </Text>
        ) : null}
        {text2 ? (
          <Text className="text-sm font-medium text-stone-800 leading-snug mt-1">
            {text2}
          </Text>
        ) : null}
      </View>
    </View>
  ),
  error: ({ text1, text2 }: BaseToastProps) => (
    <View className="max-w-lg flex-row w-[90%] bg-red-300 border-sm rounded-2xl p-4 justify-center gap-4 items-center">
      <Feather name="alert-circle" size={32} color="#1c1917" />
      <View className="flex-col flex-1">
        {text1 ? (
          <Text className="font-serif tracking-wide text-xl text-stone-900">
            {text1}
          </Text>
        ) : null}
        {text2 ? (
          <Text className="text-sm font-medium text-stone-800 leading-snug mt-1">
            {text2}
          </Text>
        ) : null}
      </View>
    </View>
  ),
};
