import { lazy, Suspense } from "react";

const PlayContainer = lazy(() => import("@/components/containers/PlayContainer"));

export default function Play() {
  return (
    <Suspense fallback={null}>
      <PlayContainer />
    </Suspense>
  );
}
