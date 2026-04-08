import CreateClueView, { SelectionRange } from "@/components/ui/CreateClueView";
import { supabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type ClueComponentPayload = {
  ranges: { start: number; end: number }[];
  explanation: string;
};

type ClueInsertPayload = {
  user_id: string;
  clue_text: string;
  answer: string;
  definition: ClueComponentPayload;
  indicator?: ClueComponentPayload | null;
  fodder?: ClueComponentPayload | null;
};

export default function CreateClueContainer() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [session, setSession] = useState<{
    user: { id: string; email?: string | null };
  } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
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
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Select some text before assigning ${label}.`,
      });
      return;
    }

    const start = Math.min(selection.start, selection.end);
    const end = Math.max(selection.start, selection.end);
    if (start < 0 || end <= start) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Invalid selection for ${label}.`,
      });
      return;
    }

    const text = clueText.slice(start, end);
    if (!text.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: `Selection for ${label} is empty.`,
      });
      return;
    }

    setter((prev) => {
      if (prev.some((item) => item.start === start && item.end === end)) {
        return prev;
      }
      return [...prev, { start, end, text }];
    });
  };

  const submit = async () => {
    if (!session?.user) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "You must be logged in to submit a clue.",
      });
      return;
    }

    if (!clueText.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Clue text is required.",
      });
      return;
    }
    if (!answer.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Answer is required.",
      });
      return;
    }
    if (!definitionSelections.length || !definitionExplanation.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Definition selection and explanation are required.",
      });
      return;
    }

    if (indicatorSelections.length && !indicatorExplanation.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Indicator explanation is required when text is selected.",
      });
      return;
    }

    if (fodderSelections.length && !fodderExplanation.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Fodder explanation is required when text is selected.",
      });
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
      user_id: session.user.id,
      clue_text: clueText.trim(),
      answer: answer.trim(),
      definition,
      indicator,
      fodder,
    };

    try {
      setSaving(true);
      const { error: insertError } = await supabase
        .from("submitted_clues")
        .insert(payload);

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: insertError.message || "Failed to save clue.",
        });
        return;
      }

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Clue submitted successfully! It will be reviewed by our team.",
      });
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
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.message || "Unexpected error while saving.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CreateClueView
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      authLoading={authLoading}
      isSignedIn={Boolean(session)}
      sessionEmail={session?.user.email ?? null}
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
      bottomInset={Math.max(insets.bottom, 16)}
      onSignOut={handleSignOut}
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
