import SectionCard from "@/components/ui/SectionCard";
import { ClueData } from "@/data/clues";
import { Text, View } from "react-native";
import Animated, { FadeOut, SlideInDown } from "react-native-reanimated";

type WonExplanationProps = {
  clue: ClueData;
};

export default function WonExplanation({ clue }: WonExplanationProps) {
  return (
    <Animated.View entering={SlideInDown} exiting={FadeOut}>
      <SectionCard className="mt-6 max-w-lg w-full mx-auto px-6">
        <Text className="font-serif tracking-wide font-bold text-xl">Explanation</Text>
        <View className="mt-4 gap-4">
          <View className="gap-1">
            <Text className="title-sm uppercase">Definition</Text>
            <Text className="body-base">{clue.definition.explanation}</Text>
          </View>
          {clue.indicator?.explanation ? (
            <View className="gap-1">
              <Text className="title-sm uppercase">Indicator</Text>
              <Text className="body-base">{clue.indicator.explanation}</Text>
            </View>
          ) : null}
          {clue.fodder?.explanation ? (
            <View className="gap-1">
              <Text className="title-sm uppercase">Fodder</Text>
              <Text className="body-base">{clue.fodder.explanation}</Text>
            </View>
          ) : null}
        </View>
      </SectionCard>
    </Animated.View>
  );
}
