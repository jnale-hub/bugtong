import ActionButton from "@/components/ActionButton";
import FormField from "@/components/ui/FormField";
import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";
import SectionCard from "@/components/ui/SectionCard";
import SelectionChips from "@/components/ui/SelectionChips";
import { Feather } from "@expo/vector-icons";
import { Pressable, Text, TextInput, View } from "react-native";

type Range = { start: number; end: number };
export type SelectionRange = Range & { text: string };

type CreateClueViewProps = {
  onBack: () => void;
  authLoading: boolean;
  isSignedIn: boolean;
  sessionEmail: string | null;
  clueText: string;
  answer: string;
  selection: { start: number; end: number } | null;
  definitionSelections: SelectionRange[];
  indicatorSelections: SelectionRange[];
  fodderSelections: SelectionRange[];
  definitionExplanation: string;
  indicatorExplanation: string;
  fodderExplanation: string;
  saving: boolean;
  error: string | null;
  success: string | null;
  bottomInset: number;
  onSignOut: () => void;
  onClueTextChange: (value: string) => void;
  onAnswerChange: (value: string) => void;
  onSelectionChange: (start: number, end: number) => void;
  onAddDefinition: () => void;
  onAddIndicator: () => void;
  onAddFodder: () => void;
  onRemoveDefinition: (index: number) => void;
  onRemoveIndicator: (index: number) => void;
  onRemoveFodder: (index: number) => void;
  onDefinitionExplanationChange: (value: string) => void;
  onIndicatorExplanationChange: (value: string) => void;
  onFodderExplanationChange: (value: string) => void;
  onSubmit: () => void;
};

export default function CreateClueView({
  onBack,
  authLoading,
  isSignedIn,
  sessionEmail,
  clueText,
  answer,
  selection,
  definitionSelections,
  indicatorSelections,
  fodderSelections,
  definitionExplanation,
  indicatorExplanation,
  fodderExplanation,
  saving,
  error,
  success,
  bottomInset,
  onSignOut,
  onClueTextChange,
  onAnswerChange,
  onSelectionChange,
  onAddDefinition,
  onAddIndicator,
  onAddFodder,
  onRemoveDefinition,
  onRemoveIndicator,
  onRemoveFodder,
  onDefinitionExplanationChange,
  onIndicatorExplanationChange,
  onFodderExplanationChange,
  onSubmit,
}: CreateClueViewProps) {
  return (
    <PageShell>
      <PageHeader
        left={
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Back"
            className="flex-row items-center gap-1"
          >
            <Feather name="chevron-left" size={18} color="#1f1f1f" />
            <Text className=" text-sm">Back</Text>
          </Pressable>
        }
        right={<Text className="font-serif text-lg">Bugtong</Text>}
      />

      <Text className="font-serif text-2xl mt-3">Create clue</Text>

      {authLoading ? (
        <SectionCard className="mt-6">
          <Text className=" text-sm/70" accessibilityLabel="Checking session">
            Checking session...
          </Text>
        </SectionCard>
      ) : isSignedIn ? (
        <Text className=" text-sm/70 mt-2">
          Signed in as {sessionEmail || "user"}.
        </Text>
      ) : null}

      <View className="mt-6 gap-4">
        <FormField label="Clue text">
          <TextInput
            value={clueText}
            onChangeText={onClueTextChange}
            onSelectionChange={(event) => {
              const nextSelection = event.nativeEvent.selection;
              onSelectionChange(nextSelection.start, nextSelection.end);
            }}
            placeholder="Enter the clue text"
            accessibilityLabel="Clue text"
            className="border-2 border-stone-900 rounded-2xl bg-stone-50/90 shadow-soft px-4 py-3  text-2xl leading-snug"
            multiline
          />
        </FormField>

        <SectionCard>
          <Text className=" text-sm/70">
            Highlight text above, then assign it to a clue component.
          </Text>
          <Text className=" text-xs/60 mt-1">
            Selected:{" "}
            {selection && selection.start !== selection.end
              ? `"${clueText.slice(selection.start, selection.end)}"`
              : "none"}
          </Text>
          <View className="flex-row flex-wrap gap-2 mt-3">
            <Pressable
              onPress={onAddDefinition}
              accessibilityRole="button"
              accessibilityLabel="Add selection to definition"
              className="px-3 py-2 border-2 border-stone-900 rounded-full bg-blue-300/80"
            >
              <Text className=" text-sm">Add to definition</Text>
            </Pressable>
            <Pressable
              onPress={onAddIndicator}
              accessibilityRole="button"
              accessibilityLabel="Add selection to indicator"
              className="px-3 py-2 border-2 border-stone-900 rounded-full bg-emerald-300/70"
            >
              <Text className=" text-sm">Add to indicator</Text>
            </Pressable>
            <Pressable
              onPress={onAddFodder}
              accessibilityRole="button"
              accessibilityLabel="Add selection to fodder"
              className="px-3 py-2 border-2 border-stone-900 rounded-full bg-yellow-300/80"
            >
              <Text className=" text-sm">Add to fodder</Text>
            </Pressable>
          </View>
        </SectionCard>

        <FormField label="Answer">
          <TextInput
            value={answer}
            onChangeText={onAnswerChange}
            placeholder="ANSWER"
            accessibilityLabel="Answer"
            className="border-2 border-stone-900 rounded-2xl px-4 py-3  text-base"
          />
        </FormField>

        <Divider label="Definition" />
        <SelectionChips
          selections={definitionSelections}
          onRemove={onRemoveDefinition}
        />

        <FormField label="Definition explanation">
          <TextInput
            value={definitionExplanation}
            onChangeText={onDefinitionExplanationChange}
            placeholder="Explain the definition"
            accessibilityLabel="Definition explanation"
            className="border-2 border-stone-900 rounded-2xl px-4 py-3  text-base"
            multiline
          />
        </FormField>

        <Divider label="Indicator (optional)" />
        <SelectionChips
          selections={indicatorSelections}
          onRemove={onRemoveIndicator}
        />

        <FormField label="Indicator explanation">
          <TextInput
            value={indicatorExplanation}
            onChangeText={onIndicatorExplanationChange}
            placeholder="Explain the indicator"
            accessibilityLabel="Indicator explanation"
            className="border-2 border-stone-900 rounded-2xl px-4 py-3  text-base"
            multiline
          />
        </FormField>

        <Divider label="Fodder (optional)" />
        <SelectionChips
          selections={fodderSelections}
          onRemove={onRemoveFodder}
        />

        <FormField label="Fodder explanation">
          <TextInput
            value={fodderExplanation}
            onChangeText={onFodderExplanationChange}
            placeholder="Explain the fodder"
            accessibilityLabel="Fodder explanation"
            className="border-2 border-stone-900 rounded-2xl px-4 py-3  text-base"
            multiline
          />
        </FormField>
      </View>

      {error ? (
        <Text className="text-sm text-red-600 mt-4">{error}</Text>
      ) : null}
      {success ? (
        <Text className="text-sm text-green-700 mt-4">{success}</Text>
      ) : null}

      <View className="mt-6" style={{ paddingBottom: bottomInset }}>
        <ActionButton
          label={saving ? "Saving..." : "Save clue"}
          color="bg-emerald-300"
          onPress={onSubmit}
          disabled={saving || !isSignedIn}
        />
      </View>
    </PageShell>
  );
}

type DividerProps = {
  label: string;
};

function Divider({ label }: DividerProps) {
  return (
    <View className="mt-4">
      <Text className="font-serif text-lg">{label}</Text>
    </View>
  );
}
