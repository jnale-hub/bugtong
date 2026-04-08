import { Link } from "expo-router";
import { Pressable, Text } from "react-native";

export default function Logo() {
  return (
    <Link href="/" asChild>
      <Pressable accessibilityRole="link" accessibilityLabel="Go to home">
        <Text className={`text-lg font-bold`}>
          BUGTONG
        </Text>
      </Pressable>
    </Link>
  );
}
