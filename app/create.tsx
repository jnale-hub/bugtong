import { lazy, Suspense } from "react";

const CreateClueContainer = lazy(
  () => import("@/components/containers/CreateClueContainer"),
);

export default function CreateClue() {
  return (
    <Suspense fallback={null}>
      <CreateClueContainer />
    </Suspense>
  );
}
