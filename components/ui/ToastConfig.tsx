import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { BaseToastProps } from "react-native-toast-message";

export const toastConfig = {
  success: ({ text1, text2 }: BaseToastProps) => (
    <View className="max-w-lg flex-row items-start w-[90%] bg-emerald-200 border-[3px] border-stone-900 rounded-2xl p-4 shadow-soft">
      <View className="mt-0.5 mr-3">
        <Feather name="check-circle" size={20} color="#1c1917" />
      </View>
      <View className="flex-col flex-1">
        {text1 ? (
          <Text className="font-serif text-xl tracking-tight text-stone-900">
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
    <View className="max-w-lg flex-row items-start w-[90%] bg-red-300 border-[3px] border-stone-900 rounded-2xl p-4 shadow-soft-sm">
      <View className="mt-0.5 mr-3">
        <Feather name="alert-circle" size={20} color="#1c1917" />
      </View>
      <View className="flex-col flex-1">
        {text1 ? (
          <Text className="font-serif text-xl tracking-tight text-stone-900">
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
