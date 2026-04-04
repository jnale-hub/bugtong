import React, { useMemo } from "react";
import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";

type EmojiGridProps = {
  emoji: string;
  cellSize?: number;
  margin?: number;
  opacity?: number;
};

export const EmojiGrid: React.FC<EmojiGridProps> = ({
  emoji,
  cellSize = 100,
  margin = 5,
  opacity = 0.1,
}) => {
  const SCREEN_DIMS = Dimensions.get("window");

  const gridContent = useMemo(() => {
    if (Platform.OS === "web") {
      const effectiveSize = 60 + margin * 2;
      const innerOffset = effectiveSize / 2;
      const outerOffset = effectiveSize * 1.5;

      const svgPattern = `<svg xmlns="http://www.w3.org/2000/svg" width="${effectiveSize * 2}" height="${effectiveSize * 2}">
        <g font-size="48" fill-opacity="${opacity}" style="font-family: system-ui, sans-serif;" text-anchor="middle">
          <text x="${innerOffset}" y="${innerOffset + 16}" transform="rotate(-15 ${innerOffset} ${innerOffset})">${emoji}</text>
          <text x="${outerOffset}" y="${innerOffset + 16}" transform="rotate(15 ${outerOffset} ${innerOffset})">${emoji}</text>
          <text x="${innerOffset}" y="${outerOffset + 16}" transform="rotate(15 ${innerOffset} ${outerOffset})">${emoji}</text>
          <text x="${outerOffset}" y="${outerOffset + 16}" transform="rotate(-15 ${outerOffset} ${outerOffset})">${emoji}</text>
        </g>
      </svg>`;

      const base64 = btoa(unescape(encodeURIComponent(svgPattern)));
      return {
        uri: `data:image/svg+xml;base64,${base64}`,
        size: effectiveSize * 2,
      };
    }

    const numRows = Math.ceil(SCREEN_DIMS.height / cellSize) + 4;
    const numCols = Math.ceil(SCREEN_DIMS.width / cellSize) + 4;

    return Array.from({ length: numRows }).map((_, row) => (
      <View key={`r-${row}`} style={styles.row}>
        {Array.from({ length: numCols }).map((_, col) => (
          <View
            key={`c-${row}-${col}`}
            style={[
              styles.cell,
              {
                margin,
                transform: [
                  { rotate: (row + col) % 2 === 0 ? "-15deg" : "15deg" },
                ],
              },
            ]}
          >
            <Text style={[styles.emoji, { opacity }]}>{emoji}</Text>
          </View>
        ))}
      </View>
    ));
  }, [emoji, cellSize, margin, opacity, SCREEN_DIMS.width, SCREEN_DIMS.height]);

  if (Platform.OS === "web") {
    const webData = gridContent as { uri: string; size: number };
    return (
      <View
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={
          {
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url("${webData.uri}")`,
            backgroundRepeat: "repeat",
            backgroundSize: `${webData.size}px ${webData.size}px`,
            backgroundPosition: "center",
          } as any
        }
      />
    );
  }

  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.container}
    >
      {gridContent as React.ReactNode}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
  },
  cell: {},
  emoji: {
    fontSize: 48,
    opacity: 0.9,
  },
});

export default EmojiGrid;
