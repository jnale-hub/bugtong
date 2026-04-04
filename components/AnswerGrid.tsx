import { memo, useEffect, useMemo } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type Props = {
  answer: string;
  guess: string[];
  status: "playing" | "won";
  shake: number;
  revealed?: number[];
};

type LayoutPart =
  | { type: "separator"; char: string }
  | { type: "word"; indices: number[] };

const AnswerGrid = ({ answer, guess, status, shake, revealed = [] }: Props) => {
  const wordLayout = useMemo<LayoutPart[]>(() => {
    let charCounter = 0;
    return answer.split(/([\s-])/).map((part) => {
      if (part === " " || part === "-") {
        return { type: "separator", char: part };
      }
      const indices = part.split("").map(() => charCounter++);
      return { type: "word", indices };
    });
  }, [answer]);

  const activeIndex = useMemo(() => {
    if (status !== "playing") return -1;
    const firstEmpty = guess.findIndex((c) => c === "");
    return firstEmpty !== -1 ? firstEmpty : guess.length - 1;
  }, [guess, status]);

  const revealedSet = useMemo(() => new Set(revealed), [revealed]);

  // Shake animation
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (shake > 0) {
      if (shake % 2 === 0) {
        translateX.value = 0;
      } else {
        translateX.value = withSequence(
          withTiming(-10, { duration: 50 }),
          withTiming(10, { duration: 100 }),
          withTiming(-10, { duration: 100 }),
          withTiming(10, { duration: 100 }),
          withTiming(0, { duration: 50 }),
        );
      }
    }
  }, [shake, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[animatedStyle]}>
      <View className="flex-row flex-wrap gap-y-4 justify-center items-center">
        {wordLayout.map((part, wordIdx) => {
          if (part.type === "separator") {
            if (part.char === " ") {
              return null;
            }

            return (
              <View
                key={`sep-${wordIdx}`}
                className="w-6 h-12 items-center justify-center mb-4"
              >
                <Text className="text-3xl font-extrabold text-ink">
                  {part.char}
                </Text>
              </View>
            );
          }

          const nextPart = wordLayout[wordIdx + 1];
          const hasTrailingSpace =
            nextPart?.type === "separator" && nextPart.char === " ";

          return (
            <View
              key={`word-${wordIdx}`}
              className={`flex-row border-4 border-ink rounded-lg shadow-soft shadow-blue-400 bg-white overflow-hidden w-min ${hasTrailingSpace ? "mr-3" : "mr-1"}`}
            >
              {part.indices.map((index, i, arr) => {
                const value = guess[index];
                const isLast = i === arr.length - 1;
                const cellBgClass =
                  status === "won"
                    ? "bg-pastel-mint"
                    : revealedSet.has(index)
                      ? "bg-pastel-yellow"
                      : activeIndex === index
                        ? "bg-emerald-300"
                        : "bg-white";

                return (
                  <View
                    key={index}
                    className={`
                    relative w-10 h-10 sm:w-12 sm:h-12
                    flex items-center justify-center 
                    pb-1 
                    ${isLast ? "" : "border-r-4 border-ink"}
                    ${cellBgClass}
                  `}
                  >
                    {value ? (
                      <Text className="font-sansita sm:text-4xl text-3xl font-extrabold text-ink">
                        {value}
                      </Text>
                    ) : null}
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
};

export default memo(AnswerGrid);
