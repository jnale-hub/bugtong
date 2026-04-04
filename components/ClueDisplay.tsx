import { ClueComponent, ClueData, TextRange } from "@/data/clues";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";

type ClueDisplayProps = {
  clue?: ClueData | null;
  loading?: boolean;
  activeHints: {
    showIndicator: boolean;
    showFodder: boolean;
    showDefinition: boolean;
  };
  onExplain?: (title: string, body: string) => void;
};

export default function ClueDisplay({
  clue,
  loading = false,
  activeHints,
  onExplain,
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
      <View className="bg-white rounded-lg p-4 pb-3 mb-8 min-h-24">
        <View className="gap-2 my-auto">
          <View className="bg-ink/10 h-6 w-full rounded animate-pulse" />
          <View className="bg-ink/10 h-6 w-11/12 rounded animate-pulse" />
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-lg p-4 pb-3 mb-8 min-h-24">
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

          if (!type || !onExplain) {
            return <Segment key={i} text={seg.text} type={type} />;
          }

          const title =
            type === "definition"
              ? "Definition"
              : type === "indicator"
                ? "Indicator"
                : "Fodder";

          return (
            <Pressable
              key={i}
              onPress={() =>
                onExplain(title, explanation || "No explanation provided.")
              }
            >
              <Segment text={seg.text} type={type} />
            </Pressable>
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
  if (type === "indicator") specificClasses = "bg-emerald-300 text-ink";
  else if (type === "fodder") specificClasses = "bg-pastel-yellow text-ink";
  else if (type === "definition") specificClasses = "bg-pastel-blue text-ink";

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
