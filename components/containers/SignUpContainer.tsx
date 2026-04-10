import AuthView from "@/components/ui/AuthView";
import { getSupabase } from "@/utils/supabase";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";

export default function SignUpContainer() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const dateLabel = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, []);

  const handleSignUp = async () => {
    setError(null);
    setSuccess(null);
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Name, email, and password are required.");
      return;
    }

    try {
      setLoading(true);
      const supabase = await getSupabase();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            display_name: name.trim(),
            username: name.trim(),
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || "Failed to sign up.");
        return;
      }

      if (data?.user && !data.session) {
        setSuccess("Check your email to confirm your account.");
      } else {
        router.replace("/create");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unexpected error during sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthView
      dateLabel={dateLabel}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      title="Gumawa ng account!"
      name={name}
      email={email}
      password={password}
      loading={loading}
      error={error}
      success={success}
      submitColor="bg-rose-300"
      onNameChange={setName}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSignUp}
      submitLabel="Create account"
      footerText="Already have an account?"
      footerActionText="Sign in"
      onFooterAction={() => router.push("/sign-in")}
    />
  );
}
