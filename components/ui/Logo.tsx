import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Logo() {
  return (
    <Link href="/" asChild>
      <Pressable accessibilityRole="link" accessibilityLabel="Go to home">
        <View className="flex-row items-center justify-center">
          <View className="w-6 h-6 border-2 border-stone-900 bg-emerald-300 flex items-center justify-center rounded">
            <Text className="font-serif sm:text-xl text-lg font-bold flex-row text-center my-auto -rotate-3">
              B
            </Text>
          </View>
          <Text className="text-lg sm:text-xl font-bold font-serif hidden sm:inline-block">
            ugtong
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
