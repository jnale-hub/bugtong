import Head from "expo-router/head";
import { lazy, Suspense } from "react";

const SignUpContainer = lazy(
  () => import("@/components/containers/SignUpContainer"),
);

export default function SignUp() {
  return (
    <>
      <Head>
        <title>Create Account | Bugtong</title>
        <meta
          name="description"
          content="Create your Bugtong account to submit original cryptic clues and join the puzzle community."
        />
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href="https://bugtong.online/sign-up" />
      </Head>
      <Suspense fallback={null}>
        <SignUpContainer />
      </Suspense>
    </>
  );
}
