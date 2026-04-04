import ActionButton from "@/components/ActionButton";
import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";
import SectionCard from "@/components/ui/SectionCard";
import { Text, View } from "react-native";

type HomeViewProps = {
  dateLabel: string;
  clueText: string | null;
  loading: boolean;
  error: string | null;
  onPlay: () => void;
  bottomInset: number;
};

export default function HomeView({
  dateLabel,
  clueText,
  loading,
  error,
  onPlay,
  bottomInset,
}: HomeViewProps) {
  return (
    <PageShell
      emoji="🧩"
      footer={
        <View
          className="w-full max-w-2xl mx-auto"
          style={{ paddingBottom: bottomInset }}
        ></View>
      }
    >
      {error && !loading ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-xl font-bold text-ink text-center">
            {error || "No clue available today!"}
          </Text>
        </View>
      ) : (
        <>
          <PageHeader
            center={
              <Text className="font-mulish text-sm text-ink/70">
                {dateLabel}
              </Text>
            }
            right={
              <Text className="font-sansita text-lg text-ink">Bugtong 🇵🇭</Text>
            }
          />

          <SectionCard className="mt-6 flex-col gap-y-4 py-6 justify-center items-center">
            <Text className="font-sansita text-3xl text-ink leading-tight text-center font-bold">
              Bugtong of the Day
            </Text>
            {loading || !clueText ? (
              <View className="gap-2 w-full items-center py-6 animate-pulse">
                <View className="bg-ink/10 h-6 w-full rounded" />
                <View className="bg-ink/10 h-6 w-10/12 rounded" />
              </View>
            ) : (
              <Text className="text-2xl leading-snug text-ink text-center py-4">
                {clueText}
              </Text>
            )}
            <ActionButton
              label="Play today"
              color="bg-emerald-300"
              onPress={onPlay}
            />
            <Text className="font-mulish text-sm text-ink/70">{dateLabel}</Text>
          </SectionCard>
        </>
      )}
    </PageShell>
  );
}
