import Head from "expo-router/head";
import { lazy, Suspense } from "react";

const HomeContainer = lazy(
  () => import("@/components/containers/HomeContainer"),
);

export default function Home() {
  return (
    <>
      <Head>
        <title>Bugtong Cryptic - Daily Filipino Minute Cryptic Puzzle</title>
        <meta
          name="description"
          content="Minute cryptic para sa Filipino players. Araw-araw na Bugtong cryptic puzzle na mabilis sagutan."
        />
        <link rel="canonical" href="https://bugtong.online/" />
        <meta
          property="og:title"
          content="Bugtong Cryptic - Daily Filipino Minute Cryptic Puzzle"
        />
        <meta
          property="og:description"
          content="Minute cryptic para sa Filipino players. Araw-araw na Bugtong cryptic puzzle na mabilis sagutan."
        />
        <meta property="og:url" content="https://bugtong.online/" />
      </Head>
      <Suspense fallback={null}>
        <HomeContainer />
      </Suspense>
    </>
  );
}
