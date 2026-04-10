import { lazy, Suspense } from "react";

const SignInContainer = lazy(
  () => import("@/components/containers/SignInContainer"),
);

export default function SignIn() {
  return (
    <Suspense fallback={null}>
      <SignInContainer />
    </Suspense>
  );
}
