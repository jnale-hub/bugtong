import HomeView from "@/components/ui/HomeView";
import { useDailyClue } from "@/hooks/useDailyClue";
import { useRecentClues } from "@/hooks/useRecentClues";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeContainer() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { clue, loading, error } = useDailyClue();
  const { clues: recentClues, loading: recentLoading } = useRecentClues();

  const todayLabel = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, []);

  return (
    <HomeView
      dateLabel={todayLabel}
      clueText={clue?.clueText ?? null}
      loading={loading}
      error={error}
      pastClues={recentClues.map((item) => ({
        id: item.id,
        dateKey: item.playDate,
        dateLabel: new Date(`${item.playDate}T00:00:00`).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          },
        ),
        clueText: item.clueText,
      }))}
      pastLoading={recentLoading}
      onPlay={() => router.push("/play")}
      onPlayPast={(dateKey) =>
        router.push({ pathname: "/play", params: { date: dateKey } })
      }
      bottomInset={Math.max(insets.bottom, 16)}
    />
  );
}
