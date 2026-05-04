import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const routes = [
  "/",
  "/pricing",
  "/for-clinics",
  "/glp-1-tracker",
  "/ozempic-tracker",
  "/wegovy-tracker",
  "/mounjaro-tracker",
  "/zepbound-tracker",
  "/glp-1-side-effect-tracker",
  "/glp-1-clinic-dashboard",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.8,
  }));
}
