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
      <SectionCard className="mt-6 max-w-lg w-full mx-auto">
        <Text className="font-serif font-bold text-xl">Explanation</Text>
        <View className="mt-4 gap-4">
          <View className="gap-1">
            <Text className=" text-xs uppercase tracking-wide/70">
              Definition
            </Text>
            <Text className="leading-relaxed">
              {clue.definition.explanation}
            </Text>
          </View>
          {clue.indicator?.explanation ? (
            <View className="gap-1">
              <Text className=" text-xs uppercase tracking-wide/70">
                Indicator
              </Text>
              <Text className="leading-relaxed">
                {clue.indicator.explanation}
              </Text>
            </View>
          ) : null}
          {clue.fodder?.explanation ? (
            <View className="gap-1">
              <Text className=" text-xs uppercase tracking-wide/70">
                Fodder
              </Text>
              <Text className="leading-relaxed">{clue.fodder.explanation}</Text>
            </View>
          ) : null}
        </View>
      </SectionCard>
    </Animated.View>
  );
}
