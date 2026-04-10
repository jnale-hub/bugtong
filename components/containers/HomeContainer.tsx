import HomeView from "@/components/ui/HomeView";
import { useDailyClue } from "@/hooks/useDailyClue";
import { useRecentClues } from "@/hooks/useRecentClues";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";

type HomeUser = {
  isSignedIn: boolean;
  displayName: string | null;
};

export default function HomeContainer() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<HomeUser>({
    isSignedIn: false,
    displayName: null,
  });
  const { clue, loading, error } = useDailyClue();
  const { clues: recentClues, loading: recentLoading } = useRecentClues();

  useEffect(() => {
    let isMounted = true;

    const deriveDisplayName = (user: any): string | null => {
      const metadata = user?.user_metadata ?? {};
      const candidate = metadata.display_name ?? null;
      return typeof candidate === "string" && candidate.trim().length > 0
        ? candidate.trim()
        : null;
    };

    const syncCurrentUser = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Failed to read auth session:", sessionError);
      }

      if (!isMounted) return;

      if (data.session?.user) {
        setCurrentUser({
          isSignedIn: true,
          displayName: deriveDisplayName(data.session.user),
        });

        // Refresh canonical user metadata so display_name is up-to-date
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) {
          console.error("Failed to refresh auth user:", userError);
          return;
        }
        if (!isMounted || !userData.user) return;

        setCurrentUser((prev) => ({
          ...prev,
          displayName: deriveDisplayName(userData.user),
        }));
      } else {
        setCurrentUser({ isSignedIn: false, displayName: null });
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setCurrentUser({
            isSignedIn: true,
            displayName: deriveDisplayName(session.user),
          });

          const { data: userData, error: userError } =
            await supabase.auth.getUser();
          if (userError) {
            console.error("Failed to refresh auth user:", userError);
            return;
          }
          if (!isMounted || !userData.user) return;

          setCurrentUser((prev) => ({
            ...prev,
            displayName: deriveDisplayName(userData.user),
          }));
        } else {
          setCurrentUser({ isSignedIn: false, displayName: null });
        }
      },
    );

    syncCurrentUser();

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

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
      onSignOut={() => {
        void supabase.auth.signOut();
      }}
      isSignedIn={currentUser.isSignedIn}
      signedInDisplayName={currentUser.displayName}
    />
  );
}
