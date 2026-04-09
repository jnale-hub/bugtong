import ActionButton from "@/components/ActionButton";
import Logo from "@/components/ui/Logo";
import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";
import PastWeekSection from "@/components/ui/PastWeekSection";
import SectionCard from "@/components/ui/SectionCard";
import { Text, View } from "react-native";

type HomeViewProps = {
  dateLabel: string;
  clueText: string | null;
  answer: string | null;
  loading: boolean;
  error: string | null;
  pastClues: {
    id: string;
    dateKey: string;
    dateLabel: string;
    clueText: string;
  }[];
  pastLoading: boolean;
  onPlay: () => void;
  onPlayPast: (dateKey: string) => void;
  bottomInset: number;
};

export default function HomeView({
  dateLabel,
  clueText,
  answer,
  loading,
  error,
  pastClues,
  pastLoading,
  onPlay,
  onPlayPast,
  bottomInset,
}: HomeViewProps) {
  const fullBleedSection = (
    <PastWeekSection
      pastClues={pastClues}
      pastLoading={pastLoading}
      onPlayPast={onPlayPast}
      bottomInset={bottomInset}
      show={!error || loading}
    />
  );

  return (
    <PageShell emoji="🧩" fullBleed={fullBleedSection}>
      {error && !loading ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-xl font-bold text-center">
            {error || "No clue available today!"}
          </Text>
        </View>
      ) : (
        <>
          <PageHeader
            left={
              <Text className="font-sans-semibold xs:text-lg">{dateLabel}</Text>
            }
            right={<Logo />}
          />

          <SectionCard className="mt-6 flex-col gap-y-4 py-6 justify-center items-center">
            <Text className="text-lg text-center body-muted uppercase tracking-tight">
              Bugtong of the Day
            </Text>
            {loading || !clueText ? (
              <View className="gap-2 w-full items-center py-6 animate-pulse">
                <View className="bg-stone-900/10 h-6 w-full rounded" />
                <View className="bg-stone-900/10 h-6 w-10/12 rounded" />
              </View>
            ) : (
              <View className="min-h-24 justify-center items-center w-full">
                <Text className="font-sans text-2xl leading-snug text-center">
                  {clueText}
                  {answer && (
                    <Text numberOfLines={1}>
                      {" "}
                      (
                      {answer
                        .split(" ")
                        .map((w) => w.length)
                        .join(", ")}
                      )
                    </Text>
                  )}
                </Text>
              </View>
            )}
            <ActionButton
              label="Play today"
              color="bg-emerald-300"
              onPress={onPlay}
            />
            <Text className="body-muted">{dateLabel}</Text>
          </SectionCard>
        </>
      )}
    </PageShell>
  );
}
