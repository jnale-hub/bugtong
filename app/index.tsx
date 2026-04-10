import Head from "expo-router/head";
import { lazy, Suspense } from "react";

const HomeContainer = lazy(
  () => import("@/components/containers/HomeContainer"),
);

export default function Home() {
  return (
    <>
      <Head>
        <title>Bugtong - Filipino Minute Cryptic Puzzle</title>
        <meta
          name="description"
          content="Bite-size minute cryptic para sa Filipino players. Araw-araw na Bugtong puzzle na mabilis sagutan."
        />
        <link rel="canonical" href="https://bugtong.online/" />
        <meta
          property="og:title"
          content="Bugtong - Filipino Minute Cryptic Puzzle"
        />
        <meta
          property="og:description"
          content="Bite-size minute cryptic para sa Filipino players. Araw-araw na Bugtong puzzle na mabilis sagutan."
        />
        <meta property="og:url" content="https://bugtong.online/" />
        <meta
          name="twitter:title"
          content="Bugtong - Filipino Minute Cryptic Puzzle"
        />
        <meta
          name="twitter:description"
          content="Bite-size minute cryptic para sa Filipino players. Araw-araw na Bugtong puzzle na mabilis sagutan."
        />
      </Head>
      <Suspense fallback={null}>
        <HomeContainer />
      </Suspense>
    </>
  );
}
