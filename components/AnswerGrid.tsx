import { memo, useCallback, useEffect, useMemo } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
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
  activeIndex?: number;
  onSelectIndex?: (index: number) => void;
};

type LayoutPart =
  | { type: "separator"; char: string }
  | { type: "word"; indices: number[] };

const AnswerCell = memo(function AnswerCell({
  index,
  value,
  status,
  isRevealed,
  isActive,
  cellSize,
  onPress,
}: {
  index: number;
  value: string;
  isLast: boolean;
  status: "playing" | "won";
  isRevealed: boolean;
  isActive: boolean;
  cellSize: number;
  onPress: (index: number) => void;
}) {
  const cellBgClass =
    status === "won"
      ? "bg-emerald-300"
      : isRevealed
        ? "bg-rose-300/80"
        : isActive
          ? "bg-emerald-300"
          : "bg-stone-50";

  const fontSize = Math.floor(cellSize * 0.75);

  return (
    <View className="bg-stone-50">
      <Pressable
        onPress={() => onPress(index)}
        style={{ width: cellSize, height: cellSize }}
        className={`
        relative
        flex items-center justify-center 
        ${cellBgClass}
      `}
      >
        {value ? (
          <Text
            style={{
              fontSize,
              includeFontPadding: true,
              paddingHorizontal: 6,
            }}
            className="font-serif text-center pb-1.5 rounded"
          >
            {value}
          </Text>
        ) : null}
      </Pressable>
    </View>
  );
});

const AnswerGrid = ({
  answer,
  guess,
  status,
  shake,
  revealed = [],
  activeIndex,
  onSelectIndex,
}: Props) => {
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

  const currentActiveIndex = useMemo(() => {
    if (status !== "playing") return -1;
    if (activeIndex !== undefined) return activeIndex;
    const firstEmpty = guess.findIndex((c) => c === "");
    return firstEmpty !== -1 ? firstEmpty : guess.length - 1;
  }, [guess, status, activeIndex]);

  const revealedSet = useMemo(() => new Set(revealed), [revealed]);

  const { width: screenWidth } = useWindowDimensions();

  const cellSize = useMemo(() => {
    let maxWordLength = 0;
    wordLayout.forEach((part) => {
      if (part.type === "word" && part.indices.length > maxWordLength) {
        maxWordLength = part.indices.length;
      }
    });

    // Approximate available width per word row.
    // Account for 32px standard margins (16px left + 16px right).
    // And approximate 6px border space per cell + 12px outer border space.
    const availableWidth = screenWidth - 32 - 12;
    const paddingAndBorders = maxWordLength * 6;

    const maxPossibleCellSize =
      (availableWidth - paddingAndBorders) / Math.max(1, maxWordLength);

    // Scale the cell size between 20px and 48px depending on length.
    return Math.max(20, Math.floor(Math.min(48, maxPossibleCellSize)));
  }, [wordLayout, screenWidth]);

  // Shake animation
  const translateX = useSharedValue(0);

  const handleSelectIndex = useCallback(
    (idx: number) => {
      onSelectIndex?.(idx);
    },
    [onSelectIndex],
  );

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

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <Animated.View style={[animatedStyle]}>
      <View className="flex-row flex-wrap gap-y-3 gap-x-2 justify-center items-center">
        {wordLayout.map((part, wordIdx) => {
          if (part.type === "separator") {
            if (part.char === " ") {
              return null;
            }

            return (
              <View
                key={`sep-${wordIdx}`}
                className="w-6 h-12 items-center justify-center mb-4 overflow-visible"
              >
                <Text className="title-1">{part.char}</Text>
              </View>
            );
          }

          return (
            <View
              key={`word-${wordIdx}`}
              className={`flex-row gap-1 sm:gap-[5px] border-4 sm:border-[5px] border-stone-900 rounded-lg bg-stone-900 w-min overflow-hidden`}
            >
              {part.indices.map((index, i, arr) => (
                <AnswerCell
                  key={index}
                  index={index}
                  value={guess[index]}
                  isLast={i === arr.length - 1}
                  status={status}
                  isRevealed={revealedSet.has(index)}
                  isActive={currentActiveIndex === index}
                  cellSize={cellSize}
                  onPress={handleSelectIndex}
                />
              ))}
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
};

export default memo(AnswerGrid);
