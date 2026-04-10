import ActionButton from "@/components/ActionButton";
import BackButton from "@/components/ui/BackButton";
import Logo from "@/components/ui/Logo";
import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";
import SectionCard from "@/components/ui/SectionCard";
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
        <PageHeader
          left={<BackButton onPress={onBack} />}
          right={<Logo />}
        />
        

        <Text className="font-serif text-center text-2xl tracking-wide mb-6">{title}</Text>

        <View className="border-sm rounded-xl bg-stone-50 px-4 py-6 gap-4 mb-6">
          <View className="gap-2">
            <Text className="body-title">Email</Text>
            <TextInput
              value={email}
              onChangeText={onEmailChange}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              accessibilityLabel="Email"
              className="border rounded-2xl px-4 py-3 body-base"
            />
          </View>
          <View className="gap-2 mb-4">
            <Text className="body-title">Password</Text>
            <TextInput
              value={password}
              onChangeText={onPasswordChange}
              placeholder="Password"
              secureTextEntry
              accessibilityLabel="Password"
              className="border rounded-2xl px-4 py-3 body-base"
            />
          </View>
          {error ? <Text className="text-red-600 font-sans-semibold">{error}</Text> : null}
          {success ? (
            <Text className="text-sm text-green-700">{success}</Text>
          ) : null}
          <ActionButton
            label={loading ? `${submitLabel}...` : submitLabel}
            color={submitColor}
            onPress={onSubmit}
            disabled={loading}
          />
        </View>

        <Pressable
          onPress={onFooterAction}
          accessibilityRole="button"
          accessibilityLabel={footerActionText}
          className="self-center"
        >
          <Text className="body-base">
            {footerText} <Text className="font-sans-semibold">{footerActionText}</Text>
          </Text>
        </Pressable>
    </PageShell>
  );
}
