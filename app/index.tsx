import { lazy, Suspense } from "react";

const HomeContainer = lazy(
  () => import("@/components/containers/HomeContainer"),
);

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContainer />
    </Suspense>
  );
}
