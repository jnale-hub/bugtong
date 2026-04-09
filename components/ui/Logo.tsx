import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

export default function Logo() {
  return (
    <Link href="/" asChild>
      <Pressable accessibilityRole="link" accessibilityLabel="Go to home">
        <View className="flex-row items-center justify-center gap-1">
          <Text className="text-lg sm:text-xl font-sans-semibold hidden sm:block tracking-tight">
            bugtong.online
          </Text>
          <Image
            source={require("../../assets/images/logo.png")}
            className="w-6 h-6"
            style={{ width: 32, height: 32 }}
            resizeMode="contain"
          />
        </View>
      </Pressable>
    </Link>
  );
}
