import HomeView from "@/components/ui/HomeView";
import { useDailyClue } from "@/hooks/useDailyClue";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeContainer() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { clue, loading, error } = useDailyClue();

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
      onPlay={() => router.push("/play")}
      bottomInset={Math.max(insets.bottom, 16)}
    />
  );
}
