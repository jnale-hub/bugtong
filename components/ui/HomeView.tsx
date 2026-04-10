import ActionButton from "@/components/ActionButton";
import Logo from "@/components/ui/Logo";
import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";
import PastWeekSection from "@/components/ui/PastWeekSection";
import SectionCard from "@/components/ui/SectionCard";
import { Pressable, Text, View } from "react-native";

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
    isSolved: boolean;
  }[];
  pastLoading: boolean;
  onPlay: () => void;
  onPlayPast: (dateKey: string) => void;
  onCreateYourOwn: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
  isSignedIn: boolean;
  signedInDisplayName?: string | null;
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
  onCreateYourOwn,
  onSignIn,
  onSignOut,
  isSignedIn,
  signedInDisplayName,
}: HomeViewProps) {
  const signedInLabel = signedInDisplayName?.trim() || null;

  const fullBleedSection = (
    <View className="gap-y-4">
      <PastWeekSection
        pastClues={pastClues}
        pastLoading={pastLoading}
        onPlayPast={onPlayPast}
      />

      <View className="px-4 pb-16 pt-6 items-center gap-y-4 max-w-lg mx-auto">
        <Text className="text-2xl font-sans-semibold text-center text-stone-900">
          {isSignedIn
            ? "Ready to create your own bugtong?"
            : "Have a bugtong of your own?"}
        </Text>
        <Text className="body-base text-lg text-center leading-snug -mt-2">
          {isSignedIn
            ? "Share your own puzzle for others to solve!"
            : "Sign in and create your own bugtong for others to solve!"}
        </Text>
        <View className="flex-row gap-3 justify-center flex-wrap">
          <ActionButton
            label="Create yours"
            color="bg-emerald-300"
            onPress={onCreateYourOwn}
          />
          {!isSignedIn ? (
            <ActionButton
              label="Sign in"
              color="bg-rose-200"
              onPress={onSignIn}
            />
          ) : null}
        </View>

        {isSignedIn ? (
          <View className="items-center gap-2 flex-row justify-center">
            <Text className="body-base">
              {signedInLabel ? (
                <>
                  Signed in as{" "}
                  <Text className="font-sans-semibold">{signedInLabel}</Text>.
                </>
              ) : (
                "Signed in."
              )}
            </Text>
            <Pressable onPress={onSignOut} accessibilityRole="button">
              <Text className="font-sans-semibold underline text-stone-900">
                Sign out
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );

  return (
    <PageShell fullBleed={fullBleedSection}>
      <PageHeader
        left={
          <View>
            <Text className="font-sans-semibold xs:text-lg">{dateLabel}</Text>
            {isSignedIn ? (
              <Text className="body-base">
                {signedInLabel ? (
                  <>
                    Signed in as{" "}
                    <Text className="font-sans-semibold">{signedInLabel}</Text>
                  </>
                ) : (
                  "Signed in"
                )}
              </Text>
            ) : null}
          </View>
        }
        right={<Logo />}
      />

      <SectionCard className="mt-6 flex-col gap-y-4 py-6 justify-center items-center">
        {error && !loading ? (
          <View className="flex-1 items-center justify-center px-6 py-12">
            <Text className="text-xl font-sans text-center">
              {error || "No clue available today!"}
            </Text>
          </View>
        ) : (
          <>
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
          </>
        )}
      </SectionCard>
    </PageShell>
  );
}
