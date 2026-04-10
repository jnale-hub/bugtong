import Head from "expo-router/head";
import { lazy, Suspense } from "react";

const SignInContainer = lazy(
  () => import("@/components/containers/SignInContainer"),
);

export default function SignIn() {
  return (
    <>
      <Head>
        <title>Sign In | Bugtong</title>
        <meta
          name="description"
          content="Sign in to your Bugtong account to submit clues and manage your puzzle activity."
        />
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href="https://bugtong.online/sign-in" />
      </Head>
      <Suspense fallback={null}>
        <SignInContainer />
      </Suspense>
    </>
  );
}
