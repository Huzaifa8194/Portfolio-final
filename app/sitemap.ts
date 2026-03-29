import type { MetadataRoute } from "next";

/** Project case studies linked from the My Work gallery — indexed as secondary to `/my-work`. */
const MY_WORK_PROJECT_SLUGS = [
  "rivera",
  "mayvn",
  "iwrity",
  "bce",
  "oracle",
  "sr",
  "lawandbar",
] as const;

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl();
  const now = new Date();

  /** Top-level pages: home + My Work hub. */
  const main: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/my-work`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
  ];

  /** Individual projects — subs of My Work in IA; lower priority in the sitemap. */
  const projectPages: MetadataRoute.Sitemap = MY_WORK_PROJECT_SLUGS.map(
    (slug) => ({
      url: `${base}/projects/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.55,
    }),
  );

  return [...main, ...projectPages];
}
