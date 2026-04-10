import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type PastClue = {
  id: string;
  dateKey: string;
  dateLabel: string;
  clueText: string;
  isSolved: boolean;
};

type PastWeekSectionProps = {
  pastClues: PastClue[];
  pastLoading: boolean;
  onPlayPast: (dateKey: string) => void;
};

export default function PastWeekSection({
  pastClues,
  pastLoading,
  onPlayPast,
}: PastWeekSectionProps) {
  const todayKey = new Date().toISOString().split("T")[0];
  const getDayLabel = (dateKey: string) =>
    dateKey === todayKey
      ? "Today"
      : new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-US", {
          weekday: "short",
        });

  return (
    <View className="bg-stone-50 pt-6 pb-8">
      <View className="w-full max-w-2xl mx-auto px-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1 justify-center">
            <Text className="font-serif -translate-y-1 tracking-wide text-2xl">
              {`Solve more `}
            </Text>
            <Feather name="chevron-right" size={28} color="#2D2D2D" />
          </View>
          <Text className="body-muted max-sm:hidden">Tap to play</Text>
        </View>

        {pastLoading ? (
          <View className="mt-4 gap-3 flex-wrap flex-row max-md:justify-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <View
                key={i}
                className="bg-stone-900/10 h-32 w-24 rounded-xl animate-pulse"
              />
            ))}
          </View>
        ) : pastClues.length > 0 ? (
          <View className="mt-4 flex-row flex-wrap gap-3 max-md:justify-center">
            {pastClues.map((clue) => {
              const dayLabel = getDayLabel(clue.dateKey);
              const isSolved = clue.isSolved;

              return (
                <Pressable
                  key={clue.id}
                  onPress={() => onPlayPast(clue.dateKey)}
                  accessibilityRole="button"
                  accessibilityLabel={`${isSolved ? "Replay solved" : "Play"} ${dayLabel} clue`}
                  className={`rounded-xl px-6 py-4 min-w-24 ${
                    isSolved
                      ? "bg-emerald-100/50"
                      : "bg-stone-200/50"
                  }`}
                >
                  <View className="flex-col items-center justify-between gap-3">
                    <View
                      className={`h-12 w-12 items-center justify-center rounded-full ${
                        isSolved ? "bg-emerald-200" : "bg-stone-50"
                      }`}
                    >
                      <Feather
                        name={isSolved ? "check-circle" : "calendar"}
                        size={24}
                        color={isSolved ? "#065F46" : "#2D2D2D"}
                      />
                    </View>
                    <Text
                      className={`text-lg font-sans-semibold ${
                        isSolved ? "text-emerald-900" : "text-stone-900"
                      }`}
                    >
                      {dayLabel}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <Text className="mt-4 body-base">No past clues yet.</Text>
        )}
      </View>
    </View>
  );
}
