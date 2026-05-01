export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const disclaimer =
  "LeanDoze is a tracking and support tool. It does not provide medical diagnosis, treatment, or prescribing advice.";
