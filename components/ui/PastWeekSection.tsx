import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type PastClue = {
  id: string;
  dateKey: string;
  dateLabel: string;
  clueText: string;
};

type PastWeekSectionProps = {
  pastClues: PastClue[];
  pastLoading: boolean;
  onPlayPast: (dateKey: string) => void;
  bottomInset: number;
  show: boolean;
};

export default function PastWeekSection({
  pastClues,
  pastLoading,
  onPlayPast,
  bottomInset,
  show,
}: PastWeekSectionProps) {
  const todayKey = new Date().toISOString().split("T")[0];
  const getDayLabel = (dateKey: string) =>
    dateKey === todayKey
      ? "Today"
      : new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-US", {
          weekday: "short",
        });

  if (!show) return null;

  return (
    <View
      className="bg-stone-50 pt-6"
      style={{ paddingBottom: bottomInset + 32 }}
    >
      <View className="w-full max-w-2xl mx-auto px-4">
        <View className="flex-row items-center justify-between">
          <Text className="font-serif text-xl font-bold">
            Solve more bugtong
          </Text>
          <Text className=" text-xs/60">Tap to play</Text>
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

              return (
                <Pressable
                  key={clue.id}
                  onPress={() => onPlayPast(clue.dateKey)}
                  accessibilityRole="button"
                  accessibilityLabel={`Play ${dayLabel} clue`}
                  className="rounded-xl bg-stone-200/50 px-6 py-4 w-22"
                >
                  <View className="flex-col items-center justify-between gap-3">
                    <View className="h-12 w-12 items-center justify-center rounded-full bg-stone-50">
                      <Feather name="calendar" size={24} color="#2D2D2D" />
                    </View>
                    <Text className="text-lg font-semibold">{dayLabel}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <Text className="mt-4  text-sm/60">No past clues yet.</Text>
        )}
      </View>
    </View>
  );
}
