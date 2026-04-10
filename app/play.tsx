import Head from "expo-router/head";
import { lazy, Suspense } from "react";

const PlayContainer = lazy(
  () => import("@/components/containers/PlayContainer"),
);

export default function Play() {
  return (
    <>
      <Head>
        <title>Play Filipino Minute Cryptic Now | Bugtong</title>
        <meta
          name="description"
          content="Subukan ang minute cryptic challenge ngayon. Isang mabilisang Filipino Bugtong puzzle na puwedeng i-share sa social media kasama ang kaibigan mo."
        />
        <link rel="canonical" href="https://bugtong.online/play" />
        <meta
          property="og:title"
          content="Play Filipino Minute Cryptic Now | Bugtong"
        />
        <meta
          property="og:description"
          content="Subukan ang minute cryptic challenge ngayon. Isang mabilisang Filipino Bugtong puzzle na puwedeng i-share sa social media kasama ang kaibigan mo."
        />
        <meta property="og:url" content="https://bugtong.online/play" />
        <meta
          name="twitter:title"
          content="Play Filipino Minute Cryptic Now | Bugtong"
        />
        <meta
          name="twitter:description"
          content="Subukan ang minute cryptic challenge ngayon. Isang mabilisang Filipino Bugtong puzzle na puwedeng i-share sa social media kasama ang kaibigan mo."
        />
      </Head>
      <Suspense fallback={null}>
        <PlayContainer />
      </Suspense>
    </>
  );
}
