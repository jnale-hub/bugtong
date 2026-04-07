import { ClueComponent, ClueData, TextRange } from "@/data/clues";
import { useMemo } from "react";
import { Text, View } from "react-native";

type ClueDisplayProps = {
  clue?: ClueData | null;
  loading?: boolean;
  activeHints: {
    showIndicator: boolean;
    showFodder: boolean;
    showDefinition: boolean;
  };
  onExplain?: (title: string, body: string) => void;
  isSolved?: boolean;
};

export default function ClueDisplay({
  clue,
  loading = false,
  activeHints,
  onExplain,
  isSolved = false,
}: ClueDisplayProps) {
  const segments = useMemo(() => {
    if (!clue) return [];
    const cutPoints = new Set<number>([0, clue.clueText.length]);

    const addRange = (r: TextRange) => {
      cutPoints.add(r.start);
      cutPoints.add(r.end);
    };

    clue.definition.ranges.forEach(addRange);
    clue.indicator?.ranges.forEach(addRange);
    clue.fodder?.ranges.forEach(addRange);

    const sortedPoints = Array.from(cutPoints).sort((a, b) => a - b);
    const chunks: { text: string; start: number; end: number }[] = [];

    for (let i = 0; i < sortedPoints.length - 1; i++) {
      const start = sortedPoints[i];
      const end = sortedPoints[i + 1];
      chunks.push({
        text: clue.clueText.slice(start, end),
        start,
        end,
      });
    }

    return chunks;
  }, [clue]);

  if (loading || !clue) {
    return (
      <View className="bg-stone-50 rounded-lg p-4 pb-3 mb-8 min-h-24">
        <View className="gap-2 my-auto">
          <View className="bg-stone-900/10 h-6 w-full rounded animate-pulse" />
          <View className="bg-stone-900/10 h-6 w-11/12 rounded animate-pulse" />
        </View>
      </View>
    );
  }

  return (
    <View className="bg-stone-50 rounded-lg p-4 pb-3 mb-8 min-h-24">
      <Text className="text-2xl leading-snug flex-row flex-wrap my-auto">
        {segments.map((seg, i) => {
          let type: "indicator" | "fodder" | "definition" | null = null;
          let explanation: string | undefined;

          if (
            activeHints.showDefinition &&
            checkComponent(seg, clue.definition)
          ) {
            type = "definition";
            explanation = clue.definition.explanation;
          } else if (
            activeHints.showIndicator &&
            checkComponent(seg, clue.indicator)
          ) {
            type = "indicator";
            explanation = clue.indicator?.explanation;
          } else if (
            activeHints.showFodder &&
            checkComponent(seg, clue.fodder)
          ) {
            type = "fodder";
            explanation = clue.fodder?.explanation;
          }

          if (!type || !onExplain || isSolved) {
            return <Segment key={i} text={seg.text} type={type} />;
          }

          const title =
            type === "definition"
              ? "Definition"
              : type === "indicator"
                ? "Indicator"
                : "Fodder";

          return (
            <Text
              key={i}
              accessibilityRole="link"
              accessibilityLabel={`${title}: ${seg.text.trim()}`}
              onPress={() =>
                onExplain(title, explanation || "No explanation provided.")
              }
            >
              <Segment text={seg.text} type={type} />
            </Text>
          );
        })}
        <Text numberOfLines={1}>
          {" "}
          (
          {clue.answer
            .split(" ")
            .map((w) => w.length)
            .join(", ")}
          )
        </Text>
      </Text>
    </View>
  );
}

function Segment({ text, type }: { text: string; type: string | null }) {
  let specificClasses = "bg-transparent";
  if (type === "indicator") specificClasses = "bg-rose-300/80";
  else if (type === "fodder") specificClasses = "bg-yellow-300/80";
  else if (type === "definition") specificClasses = "bg-blue-300/80";

  return <Text className={specificClasses}>{text}</Text>;
}

function isInside(seg: { start: number; end: number }, target: TextRange) {
  return seg.start >= target.start && seg.end <= target.end;
}

function checkComponent(
  seg: { start: number; end: number },
  component?: ClueComponent,
) {
  if (!component) return false;
  return component.ranges.some((range) => isInside(seg, range));
}
