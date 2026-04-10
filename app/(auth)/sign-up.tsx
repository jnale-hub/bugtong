import { lazy, Suspense } from "react";

const SignUpContainer = lazy(
  () => import("@/components/containers/SignUpContainer"),
);

export default function SignUp() {
  return (
    <Suspense fallback={null}>
      <SignUpContainer />
    </Suspense>
  );
}
