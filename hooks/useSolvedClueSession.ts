import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";

type SolvedClueSession = {
  solvedAt: string;
  clueId: string | null;
  dateKey: string;
};

const STORAGE_PREFIX = "bugtong:solved-clue:";

export function useSolvedClueSession(dateKey: string) {
  const storageKey = useMemo(() => `${STORAGE_PREFIX}${dateKey}`, [dateKey]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      setIsLoaded(false);

      try {
        const storedValue = await AsyncStorage.getItem(storageKey);
        if (!isMounted) return;

        setIsSolved(Boolean(storedValue));
      } catch (err) {
        console.error("Failed to load solved clue session:", err);
        if (!isMounted) return;

        setIsSolved(false);
      } finally {
        if (isMounted) {
          setIsLoaded(true);
        }
      }
    };

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [storageKey]);

  const markSolved = useCallback(
    async (clueId: string | null) => {
      const payload: SolvedClueSession = {
        solvedAt: new Date().toISOString(),
        clueId,
        dateKey,
      };

      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(payload));
        setIsSolved(true);
      } catch (err) {
        console.error("Failed to save solved clue session:", err);
      }
    },
    [dateKey, storageKey],
  );

  const clearSession = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(storageKey);
      setIsSolved(false);
    } catch (err) {
      console.error("Failed to clear solved clue session:", err);
    }
  }, [storageKey]);

  return {
    isLoaded,
    isSolved,
    markSolved,
    clearSession,
  };
}
