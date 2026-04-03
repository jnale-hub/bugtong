import { ClueComponent, ClueData, TextRange } from "@/data/clues";
import { useMemo } from "react";
import { Text, View } from "react-native";

type ClueDisplayProps = {
  clue: ClueData;
  activeHints: {
    showIndicator: boolean;
    showFodder: boolean;
    showDefinition: boolean;
  };
};

export default function ClueDisplay({ clue, activeHints }: ClueDisplayProps) {
  const segments = useMemo(() => {
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

  // Render the clue with optional highlights based on activeHints
  return (
    <View className="bg-yellow-50 rounded-lg p-4 pb-3 mb-8 min-h-24">
      <Text className="text-2xl leading-snug flex-row flex-wrap my-auto">
        {segments.map((seg, i) => {
          // Determine the segment type for highlighting (if enabled in activeHints)
          let type: "indicator" | "fodder" | "definition" | null = null;

          if (
            activeHints.showDefinition &&
            checkComponent(seg, clue.definition)
          ) {
            type = "definition";
          } else if (
            activeHints.showIndicator &&
            checkComponent(seg, clue.indicator)
          ) {
            type = "indicator";
          } else if (
            activeHints.showFodder &&
            checkComponent(seg, clue.fodder)
          ) {
            type = "fodder";
          }

          return <Segment key={i} text={seg.text} type={type} />;
        })}
        <Text numberOfLines={1}>
          {" "}
          (
          {Array.isArray(clue.enumeration)
            ? clue.enumeration.join(",")
            : clue.enumeration}
          )
        </Text>
      </Text>
    </View>
  );
}

// Helper functions
function Segment({ text, type }: { text: string; type: string | null }) {
  // Render a span; background indicates the segment type when highlighted
  let specificClasses = "bg-transparent";
  if (type === "indicator") specificClasses = "bg-pastel-pink text-ink";
  else if (type === "fodder") specificClasses = "bg-pastel-yellow text-ink";
  else if (type === "definition") specificClasses = "bg-pastel-blue text-ink";

  return <Text className={specificClasses}>{text}</Text>;
}

// Return true if the segment is fully inside the provided range
function isInside(seg: { start: number; end: number }, target: TextRange) {
  return seg.start >= target.start && seg.end <= target.end;
}

// Check whether a segment falls inside any ranges from a clue component
function checkComponent(
  seg: { start: number; end: number },
  component?: ClueComponent,
) {
  if (!component) return false;
  return component.ranges.some((range) => isInside(seg, range));
}
