import ActionButton from "@/components/ActionButton";
import BackButton from "@/components/ui/BackButton";
import Logo from "@/components/ui/Logo";
import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";
import SelectionChips from "@/components/ui/SelectionChips";
import { Pressable, Text, TextInput, View } from "react-native";

type Range = { start: number; end: number };
export type SelectionRange = Range & { text: string };

type CreateClueViewProps = {
  onBack: () => void;
  authLoading: boolean;
  isSignedIn: boolean;
  sessionDisplayName: string | null;
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
  sessionDisplayName,
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
  const signedInLabel = sessionDisplayName || sessionEmail || "user";

  return (
    <PageShell>
      <PageHeader left={<BackButton onPress={onBack} />} right={<Logo />} />

      <Text className="font-serif text-2xl mt-3 mb-1 text-center tracking-wide">
        Gumawa ng Bugtong
      </Text>

      {authLoading ? (
        <Text
          className="body-base text-center"
          accessibilityLabel="Checking session"
        >
          Checking session...
        </Text>
      ) : isSignedIn ? (
        <Text className="body-base text-center">
          Signed in as <Text className="font-semibold">{signedInLabel}</Text>.
        </Text>
      ) : null}

      <View className="mt-6 gap-8">
        <View className="gap-2">
          <Text className="font-sans-semibold text-stone-700 ml-1 uppercase tracking-wide text-xs">
            1. Write & Tag the Clue
          </Text>
          <View className="border-sm rounded-xl bg-stone-50 overflow-hidden flex-col">
            <TextInput
              value={clueText}
              onChangeText={onClueTextChange}
              onSelectionChange={(event) => {
                const nextSelection = event.nativeEvent.selection;
                onSelectionChange(nextSelection.start, nextSelection.end);
              }}
              placeholder="Enter the clue text..."
              accessibilityLabel="Clue text"
              className="font-sans px-4 py-5 text-xl sm:text-2xl leading-snug"
              multiline
            />
            <View className="bg-stone-200/80 border-t-[3px] border-stone-900 p-3">
              <Text className="text-xs/60 mb-2 font-sans-semibold tracking-wider text-stone-600">
                {selection && selection.start !== selection.end
                  ? `Selected: "${clueText.slice(selection.start, selection.end)}"`
                  : "Highlight words above to tag them:"}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <TagButton
                  label="Definition"
                  color="bg-blue-300"
                  onPress={onAddDefinition}
                />
                <TagButton
                  label="Indicator"
                  color="bg-rose-300"
                  onPress={onAddIndicator}
                />
                <TagButton
                  label="Fodder"
                  color="bg-yellow-300"
                  onPress={onAddFodder}
                />
              </View>
            </View>
          </View>
        </View>

        <View className="gap-2">
          <Text className="font-sans-semibold text-stone-700 ml-1 uppercase tracking-wide text-xs">
            2. Answer
          </Text>
          <TextInput
            value={answer}
            onChangeText={onAnswerChange}
            placeholder="Type answer here..."
            accessibilityLabel="Answer"
            className="border-sm rounded-xl px-4 py-4 text-xl bg-stone-50 font-sans-semibold tracking-wide"
          />
        </View>

        <View className="gap-4">
          <Text className="font-sans-semibold text-stone-700 ml-1 uppercase tracking-wide text-xs">
            3. Explanations
          </Text>

          <CluePartCard
            title="Definition"
            badgeColor="bg-blue-300"
            selections={definitionSelections}
            explanation={definitionExplanation}
            onExplanationChange={onDefinitionExplanationChange}
            onRemove={onRemoveDefinition}
            placeholder="Why is this the definition?"
            required
          />

          <CluePartCard
            title="Indicator"
            badgeColor="bg-rose-300"
            selections={indicatorSelections}
            explanation={indicatorExplanation}
            onExplanationChange={onIndicatorExplanationChange}
            onRemove={onRemoveIndicator}
            placeholder="How does this indicate the operation?"
          />

          <CluePartCard
            title="Fodder"
            badgeColor="bg-yellow-300"
            selections={fodderSelections}
            explanation={fodderExplanation}
            onExplanationChange={onFodderExplanationChange}
            onRemove={onRemoveFodder}
            placeholder="What is being operated on?"
          />
        </View>
      </View>

      <View className="mt-8" style={{ paddingBottom: bottomInset }}>
        <ActionButton
          label={saving ? "Submitting..." : "Submit Clue"}
          color="bg-emerald-300"
          onPress={onSubmit}
          disabled={saving || !isSignedIn}
        />
      </View>
    </PageShell>
  );
}

function TagButton({
  label,
  color,
  onPress,
}: {
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className={`px-3 py-1.5 border-2 border-stone-900 rounded-full ${color}`}
    >
      <Text className="text-sm font-sans-semibold text-stone-900">{label}</Text>
    </Pressable>
  );
}

type CluePartCardProps = {
  title: string;
  badgeColor: string;
  selections: SelectionRange[];
  explanation: string;
  placeholder: string;
  onRemove: (index: number) => void;
  onExplanationChange: (val: string) => void;
  required?: boolean;
};

function CluePartCard({
  title,
  badgeColor,
  selections,
  explanation,
  placeholder,
  onRemove,
  onExplanationChange,
  required,
}: CluePartCardProps) {
  return (
    <View className="border-sm rounded-xl p-4 bg-stone-50">
      <View className="flex-row items-center gap-2 mb-3">
        <View
          className={`w-4 h-4 rounded-full border-2 border-stone-900 ${badgeColor}`}
        />
        <Text className="font-serif text-xl tracking-wide">{title}</Text>
        {!required && (
          <Text className="text-sm opacity-50 ml-auto font-medium">
            (Optional)
          </Text>
        )}
      </View>
      {selections.length > 0 && (
        <View className="mb-3">
          <SelectionChips selections={selections} onRemove={onRemove} />
        </View>
      )}
      <TextInput
        value={explanation}
        onChangeText={onExplanationChange}
        placeholder={placeholder}
        multiline
        className="font-sans border-2 border-stone-900/10 rounded-xl px-3 py-3 text-base bg-stone-100"
      />
    </View>
  );
}
