import Head from "expo-router/head";
import { lazy, Suspense } from "react";

const CreateClueContainer = lazy(
  () => import("@/components/containers/CreateClueContainer"),
);

export default function CreateClue() {
  return (
    <>
      <Head>
        <title>Create a Clue | Bugtong Cryptic</title>
        <meta
          name="description"
          content="Submit your own Bugtong cryptic clue for review and help expand the daily puzzle archive."
        />
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href="https://bugtong.online/create" />
      </Head>
      <Suspense fallback={null}>
        <CreateClueContainer />
      </Suspense>
    </>
  );
}
