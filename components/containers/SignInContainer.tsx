import AuthView from "@/components/ui/AuthView";
import { getSupabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";

export default function SignInContainer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dateLabel = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, []);

  const handleSignIn = async () => {
    setError(null);
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      const supabase = await getSupabase();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (signInError) {
        setError(signInError.message || "Failed to sign in.");
        return;
      }

      router.replace("/");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unexpected error during sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthView
      dateLabel={dateLabel}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      title="Mag-sign in!"
      email={email}
      password={password}
      loading={loading}
      error={error}
      submitColor="bg-blue-300/80"
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSignIn}
      submitLabel="Sign in"
      footerText="Need an account?"
      footerActionText="Create one"
      onFooterAction={() => router.push("/sign-up")}
    />
  );
}
