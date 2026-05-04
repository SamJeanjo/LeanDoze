import type { Metadata } from "next";
import { SeoContentPage } from "@/components/seo/SeoContentPage";
import { buildMetadata } from "@/lib/seo";
import { seoPages } from "@/lib/seo-pages";

const page = seoPages["glp-1-side-effect-tracker"];

export const metadata: Metadata = buildMetadata({
  title: page.title,
  description: page.description,
  path: page.slug,
  keywords: page.keywords,
});

export default function Glp1SideEffectTrackerPage() {
  return <SeoContentPage page={page} />;
}
