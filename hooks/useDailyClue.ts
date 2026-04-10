import { ClueData } from "@/data/clues";
import { getSupabase } from "@/utils/supabase";
import { useEffect, useMemo, useState } from "react";

type FetchResult = {
  clue: ClueData | null;
  error: string | null;
};

let cachedClue: ClueData | null = null;
let cachedError: string | null = null;
let cachedDate: string | null = null;
let inFlightDate: string | null = null;
let inFlightRequest: Promise<FetchResult> | null = null;

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

async function fetchDailyClue(dateKey: string): Promise<FetchResult> {
  if (cachedDate === dateKey && (cachedClue || cachedError)) {
    return { clue: cachedClue, error: cachedError };
  }

  if (inFlightRequest && inFlightDate === dateKey) {
    return inFlightRequest;
  }

  inFlightDate = dateKey;
  inFlightRequest = (async () => {
    try {
      const supabase = await getSupabase();
      const { data, error: fetchError } = await supabase
        .from("daily_clues")
        .select("id, clue_text, answer, definition, indicator, fodder")
        .eq("play_date", dateKey)
        .single();

      const shouldFallback =
        fetchError?.code === "PGRST116" || (!fetchError && !data);

      if (shouldFallback) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("daily_clues")
          .select("id, clue_text, answer, definition, indicator, fodder")
          .lte("play_date", dateKey)
          .order("play_date", { ascending: false })
          .limit(1);

        if (fallbackError) {
          console.error("Supabase Error:", fallbackError);
        }

        const latest = fallbackData?.[0];

        if (latest) {
          cachedClue = {
            id: latest.id,
            clueText: latest.clue_text,
            answer: latest.answer,
            definition: latest.definition,
            indicator: latest.indicator,
            fodder: latest.fodder,
          };
          cachedError = null;
          cachedDate = dateKey;
          return { clue: cachedClue, error: null };
        }

        cachedClue = null;
        cachedError = null;
        cachedDate = dateKey;
        return { clue: null, error: null };
      }

      if (fetchError) {
        console.error("Supabase Error:", fetchError);
        cachedClue = null;
        cachedError = "Failed to load today's clue.";
        cachedDate = dateKey;
        return { clue: null, error: cachedError };
      }

      if (data) {
        cachedClue = {
          id: data.id,
          clueText: data.clue_text,
          answer: data.answer,
          definition: data.definition,
          indicator: data.indicator,
          fodder: data.fodder,
        };
        cachedError = null;
        cachedDate = dateKey;
        return { clue: cachedClue, error: null };
      }

      cachedClue = null;
      cachedError = null;
      cachedDate = dateKey;
      return { clue: null, error: null };
    } catch (err: any) {
      console.error(err);
      const message = err.message || "An unexpected error occurred";
      cachedClue = null;
      cachedError = message;
      cachedDate = dateKey;
      return { clue: null, error: message };
    } finally {
      inFlightRequest = null;
      inFlightDate = null;
    }
  })();

  return inFlightRequest;
}

export function useDailyClue(dateKey?: string) {
  const todayKey = useMemo(() => dateKey ?? getTodayKey(), [dateKey]);
  const [clue, setClue] = useState<ClueData | null>(() =>
    cachedDate === todayKey ? cachedClue : null,
  );
  const [error, setError] = useState<string | null>(() =>
    cachedDate === todayKey ? cachedError : null,
  );
  const [loading, setLoading] = useState(() => {
    if (cachedDate !== todayKey) return true;
    return !(cachedClue || cachedError);
  });

  useEffect(() => {
    let isMounted = true;

    if (cachedDate === todayKey && (cachedClue || cachedError)) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetchDailyClue(todayKey).then((result) => {
      if (!isMounted) return;
      setClue(result.clue);
      setError(result.error);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [todayKey]);

  return { clue, loading, error };
}
