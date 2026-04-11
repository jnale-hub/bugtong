import Head from "expo-router/head";
import { lazy, Suspense } from "react";

const PlayContainer = lazy(
  () => import("@/components/containers/PlayContainer"),
);

export default function Play() {
  return (
    <>
      <Head>
        <title>Play Filipino Minute Cryptic Now | Bugtong Cryptic</title>
        <meta
          name="description"
          content="Subukan ang minute cryptic challenge ngayon. Isang mabilisang Filipino Bugtong cryptic puzzle na puwedeng i-share sa social media kasama ang kaibigan mo."
        />
        <link rel="canonical" href="https://bugtong.online/play" />
        <meta
          property="og:title"
          content="Play Filipino Minute Cryptic Now | Bugtong Cryptic"
        />
        <meta
          property="og:description"
          content="Subukan ang minute cryptic challenge ngayon. Isang mabilisang Filipino Bugtong cryptic puzzle na puwedeng i-share sa social media kasama ang kaibigan mo."
        />
        <meta property="og:url" content="https://bugtong.online/play" />
      </Head>
      <Suspense fallback={null}>
        <PlayContainer />
      </Suspense>
    </>
  );
}
