import CreateClueView, { SelectionRange } from "@/components/ui/CreateClueView";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ClueComponentPayload = {
  ranges: { start: number; end: number }[];
  explanation: string;
};

type ClueInsertPayload = {
  play_date: string;
  clue_text: string;
  answer: string;
  definition: ClueComponentPayload;
  indicator?: ClueComponentPayload | null;
  fodder?: ClueComponentPayload | null;
};

function toDateKey(value: Date) {
  return value.toISOString().split("T")[0];
}

function nextDateFrom(value?: string | null) {
  if (!value) {
    return toDateKey(new Date());
  }

  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return toDateKey(new Date());
  }

  parsed.setUTCDate(parsed.getUTCDate() + 1);
  return toDateKey(parsed);
}

export default function CreateClueContainer() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [session, setSession] = useState<{
    user: { email?: string | null };
  } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [playDate, setPlayDate] = useState("");
  const [clueText, setClueText] = useState("");
  const [answer, setAnswer] = useState("");
  const [selection, setSelection] = useState<{
    start: number;
    end: number;
  } | null>(null);

  const [definitionSelections, setDefinitionSelections] = useState<
    SelectionRange[]
  >([]);
  const [definitionExplanation, setDefinitionExplanation] = useState("");

  const [indicatorSelections, setIndicatorSelections] = useState<
    SelectionRange[]
  >([]);
  const [indicatorExplanation, setIndicatorExplanation] = useState("");

  const [fodderSelections, setFodderSelections] = useState<SelectionRange[]>(
    [],
  );
  const [fodderExplanation, setFodderExplanation] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dateLoading, setDateLoading] = useState(false);

  const dateLabel = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, []);

  const fetchNextDate = async () => {
    try {
      setDateLoading(true);
      const { data, error: fetchError } = await supabase
        .from("daily_clues")
        .select("play_date")
        .order("play_date", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error("Supabase date error:", fetchError);
        setPlayDate(nextDateFrom(null));
        return;
      }

      setPlayDate(nextDateFrom(data?.play_date ?? null));
    } catch (err) {
      console.error(err);
      setPlayDate(nextDateFrom(null));
    } finally {
      setDateLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("Auth session error:", sessionError);
        }

        if (isMounted) {
          setSession(data.session ? { user: data.session.user } : null);
          setAuthLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession ? { user: nextSession.user } : null);
      },
    );

    initAuth();
    fetchNextDate();

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authLoading && !session) {
      router.replace("/sign-in");
    }
  }, [authLoading, session, router]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error(err);
    }
  };

  const appendSelection = (
    setter: React.Dispatch<React.SetStateAction<SelectionRange[]>>,
    label: string,
  ) => {
    if (!selection || selection.start === selection.end) {
      setError(`Select some text before assigning ${label}.`);
      return;
    }

    const start = Math.min(selection.start, selection.end);
    const end = Math.max(selection.start, selection.end);
    if (start < 0 || end <= start) {
      setError(`Invalid selection for ${label}.`);
      return;
    }

    const text = clueText.slice(start, end);
    if (!text.trim()) {
      setError(`Selection for ${label} is empty.`);
      return;
    }

    setError(null);
    setter((prev) => {
      if (prev.some((item) => item.start === start && item.end === end)) {
        return prev;
      }
      return [...prev, { start, end, text }];
    });
  };

  const submit = async () => {
    setError(null);
    setSuccess(null);

    if (!playDate.trim()) {
      setError("Play date is required (YYYY-MM-DD).");
      return;
    }
    if (!clueText.trim()) {
      setError("Clue text is required.");
      return;
    }
    if (!answer.trim()) {
      setError("Answer is required.");
      return;
    }
    if (!definitionSelections.length || !definitionExplanation.trim()) {
      setError("Definition selection and explanation are required.");
      return;
    }

    if (indicatorSelections.length && !indicatorExplanation.trim()) {
      setError("Indicator explanation is required when text is selected.");
      return;
    }

    if (fodderSelections.length && !fodderExplanation.trim()) {
      setError("Fodder explanation is required when text is selected.");
      return;
    }

    const definition: ClueComponentPayload = {
      ranges: definitionSelections.map(({ start, end }) => ({ start, end })),
      explanation: definitionExplanation.trim(),
    };

    const indicator: ClueComponentPayload | null = indicatorSelections.length
      ? {
          ranges: indicatorSelections.map(({ start, end }) => ({ start, end })),
          explanation: indicatorExplanation.trim(),
        }
      : null;

    const fodder: ClueComponentPayload | null = fodderSelections.length
      ? {
          ranges: fodderSelections.map(({ start, end }) => ({ start, end })),
          explanation: fodderExplanation.trim(),
        }
      : null;

    const payload: ClueInsertPayload = {
      play_date: playDate.trim(),
      clue_text: clueText.trim(),
      answer: answer.trim(),
      definition,
      indicator,
      fodder,
    };

    try {
      setSaving(true);
      const { error: insertError } = await supabase
        .from("daily_clues")
        .insert(payload)
        .single();

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        setError(insertError.message || "Failed to save clue.");
        return;
      }

      setSuccess("Clue saved to Supabase.");
      setPlayDate("");
      setClueText("");
      setAnswer("");
      setDefinitionSelections([]);
      setDefinitionExplanation("");
      setIndicatorSelections([]);
      setIndicatorExplanation("");
      setFodderSelections([]);
      setFodderExplanation("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unexpected error while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CreateClueView
      dateLabel={dateLabel}
      onBack={() => router.back()}
      authLoading={authLoading}
      isSignedIn={Boolean(session)}
      sessionEmail={session?.user.email ?? null}
      playDate={playDate}
      dateLoading={dateLoading}
      clueText={clueText}
      answer={answer}
      selection={selection}
      definitionSelections={definitionSelections}
      indicatorSelections={indicatorSelections}
      fodderSelections={fodderSelections}
      definitionExplanation={definitionExplanation}
      indicatorExplanation={indicatorExplanation}
      fodderExplanation={fodderExplanation}
      saving={saving}
      error={error}
      success={success}
      bottomInset={Math.max(insets.bottom, 16)}
      onSignOut={handleSignOut}
      onRefreshDate={fetchNextDate}
      onClueTextChange={setClueText}
      onAnswerChange={setAnswer}
      onSelectionChange={(start, end) => setSelection({ start, end })}
      onAddDefinition={() =>
        appendSelection(setDefinitionSelections, "definition")
      }
      onAddIndicator={() =>
        appendSelection(setIndicatorSelections, "indicator")
      }
      onAddFodder={() => appendSelection(setFodderSelections, "fodder")}
      onRemoveDefinition={(index) =>
        setDefinitionSelections((prev) => prev.filter((_, i) => i !== index))
      }
      onRemoveIndicator={(index) =>
        setIndicatorSelections((prev) => prev.filter((_, i) => i !== index))
      }
      onRemoveFodder={(index) =>
        setFodderSelections((prev) => prev.filter((_, i) => i !== index))
      }
      onDefinitionExplanationChange={setDefinitionExplanation}
      onIndicatorExplanationChange={setIndicatorExplanation}
      onFodderExplanationChange={setFodderExplanation}
      onSubmit={submit}
    />
  );
}
