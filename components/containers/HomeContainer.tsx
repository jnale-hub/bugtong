import HomeView from "@/components/ui/HomeView";
import { useDailyClue } from "@/hooks/useDailyClue";
import { useRecentClues } from "@/hooks/useRecentClues";
import { useRouter } from "expo-router";
import { useMemo } from "react";

export default function HomeContainer() {
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
      answer={clue?.answer ?? null}
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
      onPlayPast={(dateKey: string) =>
        router.push({ pathname: "/play", params: { date: dateKey } })
      }
      onCreateYourOwn={() => router.push("/create")}
      onSignIn={() => router.push("/sign-in")}
    />
  );
}
