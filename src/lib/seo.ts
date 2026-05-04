import type { Metadata } from "next";

export const siteUrl = "https://leandoze.com";

export const landingDescription =
  "LeanDoze helps GLP-1 patients track dose days, symptoms, protein, hydration, weight progress, and clinician reports — with a clinic dashboard for care teams.";

export const primaryKeywords = [
  "GLP-1 app",
  "GLP-1 tracker",
  "GLP-1 companion app",
  "GLP-1 medication tracker",
  "Ozempic tracker",
  "Wegovy tracker",
  "Mounjaro tracker",
  "Zepbound tracker",
  "GLP-1 side effect tracker",
  "GLP-1 protein tracker",
  "GLP-1 hydration tracker",
  "GLP-1 weight loss tracker",
  "GLP-1 patient monitoring",
  "GLP-1 clinic dashboard",
];

export const faqItems = [
  {
    question: "What is LeanDoze?",
    answer:
      "LeanDoze is a daily GLP-1 companion app for patients and clinics. It helps organize dose days, symptoms, protein, hydration, weight progress, and clinician-ready reports in one calm tracking experience.",
  },
  {
    question: "Is LeanDoze a GLP-1 tracker?",
    answer:
      "Yes. LeanDoze is a GLP-1 tracker designed for daily routines, including dose day tracking, side effect logging, protein and hydration goals, weight progress, and report preparation.",
  },
  {
    question: "Can I track Ozempic, Wegovy, Mounjaro, or Zepbound?",
    answer:
      "LeanDoze supports tracking routines for common GLP-1 medications, including Ozempic, Wegovy, Mounjaro, Zepbound, Saxenda, Victoza, Rybelsus, and other medications entered by the patient.",
  },
  {
    question: "Does LeanDoze provide medical advice?",
    answer:
      "No. LeanDoze is a tracking and support tool only. It does not provide medical diagnosis, treatment, or prescribing advice. Patients should always consult a healthcare provider for medical questions.",
  },
  {
    question: "Can clinics monitor GLP-1 patients with LeanDoze?",
    answer:
      "LeanDoze includes a clinic dashboard concept for reviewing patient-entered GLP-1 tracking data between visits, including adherence summaries, symptom patterns, hydration and protein trends, and clinician-ready reports.",
  },
  {
    question: "Can I track side effects, protein, hydration, and weight?",
    answer:
      "Yes. LeanDoze helps patients log symptoms, protein intake, hydration, weight progress, dose rhythm, energy, movement, and notes they may want to review with a clinician.",
  },
  {
    question: "Is LeanDoze for patients or clinics?",
    answer:
      "LeanDoze is built for both. Patients use it as a daily GLP-1 companion app, while clinics can use patient-entered data to support between-visit review and more organized conversations.",
  },
];

export function buildMetadata({
  title,
  description,
  path,
  keywords = primaryKeywords,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    applicationName: "LeanDoze",
    title: {
      absolute: title,
    },
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      siteName: "LeanDoze",
      title,
      description,
      url,
      images: [
        {
          url: `${siteUrl}/brand/leandoze-logo.png`,
          width: 1200,
          height: 630,
          alt: "LeanDoze GLP-1 tracker and companion app",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/brand/leandoze-logo.png`],
    },
  };
}

export const medicationTrademarkDisclaimer =
  "Ozempic, Wegovy, Mounjaro, Zepbound, Saxenda, Victoza, and Rybelsus are trademarks of their respective owners. LeanDoze is not affiliated with or endorsed by those companies.";

export const medicalDisclaimer =
  "LeanDoze is a tracking and support tool. It does not provide medical diagnosis, treatment, or prescribing advice. Always consult your healthcare provider for medical questions.";
