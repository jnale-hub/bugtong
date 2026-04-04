import { ClueData } from "@/data/clues";
import { supabase } from "@/utils/supabase";
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
      const { data, error: fetchError } = await supabase
        .from("daily_clues")
        .select("id, clue_text, answer, definition, indicator, fodder")
        .eq("play_date", dateKey)
        .single();

      if (fetchError) {
        if (fetchError.code === "PGRST116") {
          cachedClue = null;
          cachedError = "No clue found for today!";
        } else {
          console.error("Supabase Error:", fetchError);
          cachedClue = null;
          cachedError = "Failed to load today's clue.";
        }
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
      cachedError = "No clue found for today!";
      cachedDate = dateKey;
      return { clue: null, error: cachedError };
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

export function useDailyClue() {
  const todayKey = useMemo(() => getTodayKey(), []);
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
