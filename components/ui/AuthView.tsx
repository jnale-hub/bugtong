import ActionButton from "@/components/ActionButton";
import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";
import SectionCard from "@/components/ui/SectionCard";
import { Feather } from "@expo/vector-icons";
import { Pressable, Text, TextInput, View } from "react-native";

type AuthViewProps = {
  dateLabel: string;
  onBack: () => void;
  title: string;
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
  success?: string | null;
  submitColor: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  footerText: string;
  footerActionText: string;
  onFooterAction: () => void;
};

export default function AuthView({
  dateLabel,
  onBack,
  title,
  email,
  password,
  loading,
  error,
  success,
  submitColor,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  submitLabel,
  footerText,
  footerActionText,
  onFooterAction,
}: AuthViewProps) {
  return (
    <PageShell maxWidthClassName="max-w-lg" contentClassName="pt-8 pb-8">
      <View className="gap-6">
        <PageHeader
          left={
            <Pressable onPress={onBack} className="flex-row items-center gap-1">
              <Feather name="chevron-left" size={18} color="#1f1f1f" />
              <Text className="font-mulish text-sm text-ink">Back</Text>
            </Pressable>
          }
          center={
            <Text className="font-mulish text-sm text-ink/70">{dateLabel}</Text>
          }
          right={<Text className="font-sansita text-lg text-ink">Bugtong</Text>}
        />

        <Text className="font-sansita text-2xl text-ink">{title}</Text>

        <SectionCard className="gap-4">
          <View className="gap-2">
            <Text className="font-mulish text-sm text-ink/70">Email</Text>
            <TextInput
              value={email}
              onChangeText={onEmailChange}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              className="border-2 border-ink rounded-2xl px-4 py-3 font-mulish text-base"
            />
          </View>
          <View className="gap-2">
            <Text className="font-mulish text-sm text-ink/70">Password</Text>
            <TextInput
              value={password}
              onChangeText={onPasswordChange}
              placeholder="Password"
              secureTextEntry
              className="border-2 border-ink rounded-2xl px-4 py-3 font-mulish text-base"
            />
          </View>
          {error ? <Text className="text-sm text-red-600">{error}</Text> : null}
          {success ? (
            <Text className="text-sm text-green-700">{success}</Text>
          ) : null}
          <ActionButton
            label={loading ? `${submitLabel}...` : submitLabel}
            color={submitColor}
            onPress={onSubmit}
            disabled={loading}
          />
        </SectionCard>

        <Pressable onPress={onFooterAction} className="self-center">
          <Text className="font-mulish text-sm text-ink/70">
            {footerText} {footerActionText}
          </Text>
        </Pressable>
      </View>
    </PageShell>
  );
}
