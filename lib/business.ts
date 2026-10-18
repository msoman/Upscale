export type Business = {
  name: string;
  industry: string;
  audience: string;
  budget: string;
  location: string;
  goals: string;
  website: string;
  social: string;
  brandColor: string;
  font: string;
  appearance: string;
};
export const emptyBusiness: Business = {
  name: "",
  industry: "",
  audience: "",
  budget: "",
  location: "",
  goals: "",
  website: "",
  social: "",
  brandColor: "#a78bfa",
  font: "sans-serif",
  appearance: "dark",
};
export function businessContext(b: Partial<Business>) {
  return JSON.stringify(
    Object.fromEntries(
      Object.entries(b).filter(([k]) =>
        [
          "name",
          "industry",
          "audience",
          "budget",
          "location",
          "goals",
          "website",
          "social",
        ].includes(k),
      ),
    ),
  );
}
export function validatePrompt(value: unknown): value is string {
  return (
    typeof value === "string" && value.trim().length > 0 && value.length <= 4000
  );
}
