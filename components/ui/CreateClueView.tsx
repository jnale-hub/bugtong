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
  dateLabel: string;
  onBack: () => void;
  authLoading: boolean;
  isSignedIn: boolean;
  sessionEmail: string | null;
  playDate: string;
  dateLoading: boolean;
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
  onRefreshDate: () => void;
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
  dateLabel,
  onBack,
  authLoading,
  isSignedIn,
  sessionEmail,
  playDate,
  dateLoading,
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
  onRefreshDate,
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
          <Pressable onPress={onBack} className="flex-row items-center gap-1">
            <Feather name="chevron-left" size={18} color="#1f1f1f" />
            <Text className="font-mulish text-sm text-ink">Back</Text>
          </Pressable>
        }
        center={
          <Text className="font-mulish text-sm text-ink/70">
            {dateLabel}
          </Text>
        }
        right={<Text className="font-sansita text-lg text-ink">Bugtong</Text>}
      />

      <Text className="font-sansita text-2xl text-ink mt-3">Create clue</Text>
      <Text className="font-mulish text-sm text-ink/70 mt-1">
        Highlight words in the clue text, then assign them to a clue part.
      </Text>

      {authLoading ? (
        <SectionCard className="mt-6">
          <Text className="font-mulish text-sm text-ink/70">
            Checking session...
          </Text>
        </SectionCard>
      ) : isSignedIn ? (
        <Text className="font-mulish text-sm text-ink/70 mt-2">
          Signed in as {sessionEmail || "user"}.
        </Text>
      ) : null}

      <View className="mt-6 gap-4">
        <FormField label="Play date (YYYY-MM-DD)">
          <View className="flex-row items-center gap-3">
            <TextInput
              value={playDate}
              placeholder="Loading..."
              editable={false}
              className="flex-1 border-2 border-ink rounded-2xl px-4 py-3 font-mulish text-base bg-white/80"
            />
            <Pressable
              onPress={onRefreshDate}
              disabled={dateLoading}
              className="px-3 py-2 border-2 border-ink rounded-full bg-pastel-yellow/70"
            >
              <Text className="font-mulish text-sm text-ink">
                {dateLoading ? "..." : "Refresh"}
              </Text>
            </Pressable>
          </View>
        </FormField>

        <FormField label="Clue text">
          <TextInput
            value={clueText}
            onChangeText={onClueTextChange}
            onSelectionChange={(event) => {
              const nextSelection = event.nativeEvent.selection;
              onSelectionChange(nextSelection.start, nextSelection.end);
            }}
            placeholder="Enter the clue text"
            className="border-2 border-ink rounded-2xl bg-white/90 shadow-soft px-4 py-3 font-mulish text-2xl leading-snug text-ink"
            multiline
          />
        </FormField>

        <SectionCard>
          <Text className="font-mulish text-sm text-ink/70">
            Highlight text above, then assign it to a clue component.
          </Text>
          <Text className="font-mulish text-xs text-ink/60 mt-1">
            Selected:{" "}
            {selection && selection.start !== selection.end
              ? `"${clueText.slice(selection.start, selection.end)}"`
              : "none"}
          </Text>
          <View className="flex-row flex-wrap gap-2 mt-3">
            <Pressable
              onPress={onAddDefinition}
              className="px-3 py-2 border-2 border-ink rounded-full bg-pastel-blue/70"
            >
              <Text className="font-mulish text-sm text-ink">
                Add to definition
              </Text>
            </Pressable>
            <Pressable
              onPress={onAddIndicator}
              className="px-3 py-2 border-2 border-ink rounded-full bg-emerald-300/70"
            >
              <Text className="font-mulish text-sm text-ink">
                Add to indicator
              </Text>
            </Pressable>
            <Pressable
              onPress={onAddFodder}
              className="px-3 py-2 border-2 border-ink rounded-full bg-pastel-yellow/70"
            >
              <Text className="font-mulish text-sm text-ink">
                Add to fodder
              </Text>
            </Pressable>
          </View>
        </SectionCard>

        <FormField label="Answer">
          <TextInput
            value={answer}
            onChangeText={onAnswerChange}
            placeholder="ANSWER"
            className="border-2 border-ink rounded-2xl px-4 py-3 font-mulish text-base"
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
            className="border-2 border-ink rounded-2xl px-4 py-3 font-mulish text-base"
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
            className="border-2 border-ink rounded-2xl px-4 py-3 font-mulish text-base"
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
            className="border-2 border-ink rounded-2xl px-4 py-3 font-mulish text-base"
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
      <Text className="font-sansita text-lg text-ink">{label}</Text>
    </View>
  );
}
