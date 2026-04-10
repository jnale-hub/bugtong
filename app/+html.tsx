import { ScrollViewStyleReset } from "expo-router/html";

type RootProps = {
  children: React.ReactNode;
};

const SITE_NAME = "Bugtong";
const SITE_URL = "https://bugtong.online";
const DEFAULT_TITLE = "Bugtong - Daily Filipino Minute Cryptic Puzzle";
const DEFAULT_DESCRIPTION =
  "Laruin ang Bugtong: araw-araw na Filipino cryptic puzzle at palaisipan. Subukan ang wordplay, anagram clues, at hulaan ang sagot sa loob ng ilang minuto.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/images/icon.png`;

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: ["en-PH", "fil-PH"],
  description: DEFAULT_DESCRIPTION,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/play`,
    "query-input": "required name=search_term_string",
  },
};

export default function Root({ children }: RootProps) {
  return (
    <html lang="fil">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="language" content="Filipino" />
        <title>{DEFAULT_TITLE}</title>
        <meta name="description" content={DEFAULT_DESCRIPTION} />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <meta name="theme-color" content="#c4b5fd" />
        <link rel="canonical" href={SITE_URL} />
        <link rel="alternate" hrefLang="fil-PH" href={SITE_URL} />
        <link rel="alternate" hrefLang="en-PH" href={SITE_URL} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />

        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fil_PH" />
        <meta property="og:locale:alternate" content="en_PH" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={DEFAULT_TITLE} />
        <meta property="og:description" content={DEFAULT_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:image:alt" content="Bugtong minute cryptic puzzle" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={DEFAULT_TITLE} />
        <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        <meta name="twitter:image:alt" content="Bugtong minute cryptic puzzle" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
