import ActionButton from "@/components/ActionButton";
import BackButton from "@/components/ui/BackButton";
import Logo from "@/components/ui/Logo";
import PageHeader from "@/components/ui/PageHeader";
import PageShell from "@/components/ui/PageShell";
import { Platform, Pressable, Text, TextInput, View } from "react-native";

type AuthViewProps = {
  dateLabel: string;
  onBack: () => void;
  title: string;
  name?: string;
  email: string;
  password: string;
  loading: boolean;
  error: string | null;
  success?: string | null;
  submitColor: string;
  onNameChange?: (value: string) => void;
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
  name,
  email,
  password,
  loading,
  error,
  success,
  submitColor,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  submitLabel,
  footerText,
  footerActionText,
  onFooterAction,
}: AuthViewProps) {
  const inputStyle = {
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    fontSize: 16,
    lineHeight: 20,
    ...(Platform.OS === "android"
      ? { textAlignVertical: "center" as const }
      : null),
  };

  return (
    <PageShell maxWidthClassName="max-w-lg" contentClassName="pt-8 pb-8">
      <PageHeader left={<BackButton onPress={onBack} />} right={<Logo />} />

      <Text className="font-serif text-center text-2xl tracking-wide mb-6">
        {title}
      </Text>

      <View className="border-sm rounded-xl bg-stone-50 px-4 py-6 gap-4 mb-6">
        {onNameChange ? (
          <View className="gap-2">
            <Text className="body-title">Name or username</Text>
            <TextInput
              value={name}
              onChangeText={onNameChange}
              placeholder="Your name or username"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Name or username"
              className="border rounded-2xl body-base"
              style={inputStyle}
            />
          </View>
        ) : null}
        <View className="gap-2">
          <Text className="body-title">Email</Text>
          <TextInput
            value={email}
            onChangeText={onEmailChange}
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            accessibilityLabel="Email"
            className="border rounded-2xl body-base"
            style={inputStyle}
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
            className="border rounded-2xl body-base"
            style={inputStyle}
          />
        </View>
        {error ? (
          <Text className="text-red-600 font-sans-semibold text-center">
            {error}
          </Text>
        ) : null}
        {success ? (
          <Text className="font-sans-semibold text-emerald-700 text-center">
            {success}
          </Text>
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
          {footerText}{" "}
          <Text className="font-sans-semibold">{footerActionText}</Text>
        </Text>
      </Pressable>
    </PageShell>
  );
}
