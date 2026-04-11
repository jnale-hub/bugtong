import HomeView from "@/components/ui/HomeView";
import { prefetchDailyClue, useDailyClue } from "@/hooks/useDailyClue";
import { useRecentClues } from "@/hooks/useRecentClues";
import { getSupabase } from "@/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";

type HomeUser = {
  isSignedIn: boolean;
  displayName: string | null;
};

const SOLVED_STORAGE_PREFIX = "bugtong:solved-clue:";

export default function HomeContainer() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<HomeUser>({
    isSignedIn: false,
    displayName: null,
  });
  const { clue, loading, error } = useDailyClue();
  const { clues: recentClues, loading: recentLoading } = useRecentClues();
  const [solvedByDate, setSolvedByDate] = useState<Record<string, boolean>>({});

  const loadSolvedByDate = useCallback(async () => {
    if (recentClues.length === 0) {
      setSolvedByDate({});
      return;
    }

    try {
      const keys = recentClues.map(
        (clueItem) => `${SOLVED_STORAGE_PREFIX}${clueItem.playDate}`,
      );
      const values = await AsyncStorage.multiGet(keys);

      const map = recentClues.reduce<Record<string, boolean>>(
        (acc, clueItem, index) => {
          const stored = values[index]?.[1];
          acc[clueItem.playDate] = Boolean(stored);
          return acc;
        },
        {},
      );

      setSolvedByDate(map);
    } catch (readError) {
      console.error(
        "Failed to load solved states for recent clues:",
        readError,
      );
      setSolvedByDate({});
    }
  }, [recentClues]);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | null = null;

    const deriveDisplayName = (user: any): string | null => {
      const metadata = user?.user_metadata ?? {};
      const candidate = metadata.display_name ?? null;
      return typeof candidate === "string" && candidate.trim().length > 0
        ? candidate.trim()
        : null;
    };

    const syncCurrentUser = async () => {
      const supabase = await getSupabase();
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

    const initAuth = async () => {
      const supabase = await getSupabase();

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

      unsubscribe = () => {
        authListener.subscription.unsubscribe();
      };

      await syncCurrentUser();
    };

    void initAuth();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    void loadSolvedByDate();
  }, [loadSolvedByDate]);

  useFocusEffect(
    useCallback(() => {
      void loadSolvedByDate();
    }, [loadSolvedByDate]),
  );

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
        isSolved: Boolean(solvedByDate[item.playDate]),
      }))}
      pastLoading={recentLoading}
      onPlay={() => {
        void prefetchDailyClue();
        router.push("/play");
      }}
      onPlayPast={(dateKey: string) => {
        void prefetchDailyClue(dateKey);
        router.push({ pathname: "/play", params: { date: dateKey } });
      }}
      onCreateYourOwn={() => router.push("/create")}
      onSignIn={() => router.push("/sign-in")}
      onSignOut={() => {
        void getSupabase().then((supabase) => supabase.auth.signOut());
      }}
      isSignedIn={currentUser.isSignedIn}
      signedInDisplayName={currentUser.displayName}
    />
  );
}
