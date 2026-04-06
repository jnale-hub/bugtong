import { supabase } from "@/utils/supabase";
import { useEffect, useMemo, useState } from "react";

type RecentClue = {
  id: string;
  playDate: string;
  clueText: string;
};

type RecentClueResult = {
  clues: RecentClue[];
  loading: boolean;
  error: string | null;
};

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

export function useRecentClues(): RecentClueResult {
  const todayKey = useMemo(() => getTodayKey(), []);
  const [clues, setClues] = useState<RecentClue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRecent = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("daily_clues")
        .select("id, clue_text, play_date")
        .lte("play_date", todayKey)
        .order("play_date", { ascending: false })
        .limit(8);

      if (!isMounted) return;

      if (fetchError) {
        setError("Failed to load past clues.");
        setClues([]);
        setLoading(false);
        return;
      }

      const mapped = (data || [])
        .map((row) => ({
          id: row.id as string,
          playDate: row.play_date as string,
          clueText: row.clue_text as string,
        }))
        .slice(0, 7);

      setClues(mapped);
      setLoading(false);
    };

    fetchRecent();

    return () => {
      isMounted = false;
    };
  }, [todayKey]);

  return { clues, loading, error };
}
