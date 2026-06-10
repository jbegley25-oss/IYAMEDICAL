import type { MetadataRoute } from "next";

const BASE_URL = "https://iyamedical.com";

const procedureSlugs = [
  "peripheral-artery-disease-pad",
  "liver-cancer",
  "kidney-cancer",
  "uterine-fibroids",
  "varicose-veins",
  "deep-vein-thrombosis-dvt",
  "prostate-artery-embolization",
  "pelvic-congestion-syndrome",
  "bone-metastases",
  "gi-bleeding",
  "dialysis-access",
  "chronic-back-pain",
  "varicocele",
  "pulmonary-embolism",
  "venous-insufficiency",
  "stem-cell-therapy",
  "genicular-artery-embolization",
  "chronic-knee-pain",
  "ivc-filters",
  "compression-fracture",
  "neurology",
];

const doctorSlugs = [
  "dr-ayad-agha",
  "dr-yazan-al-hasan",
  "dr-ahmed-agha",
  "dr-iya-agha",
  "dr-mustafa-ogali",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/procedures`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/doctors`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/patient-forms`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/patient-intake`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/portal`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/locations`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/insurance`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/testimonials`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/careers`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/news`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const procedurePages: MetadataRoute.Sitemap = procedureSlugs.map((slug) => ({
    url: `${BASE_URL}/procedures/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const doctorPages: MetadataRoute.Sitemap = doctorSlugs.map((slug) => ({
    url: `${BASE_URL}/doctors/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...procedurePages, ...doctorPages];
}
