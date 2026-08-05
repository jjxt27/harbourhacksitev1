import { apply, type ApplicationField } from "@/content/apply";

export type FieldErrors = Partial<Record<ApplicationField, string>>;
export type RawApplication = Record<string, unknown>;

const str = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isWebUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  return (
    (url.protocol === "https:" || url.protocol === "http:") &&
    url.hostname.includes(".") &&
    !url.hostname.endsWith(".")
  );
}

export function validateApplication(input: RawApplication): FieldErrors {
  const errors: FieldErrors = {};
  const copy = apply.errors;

  if (!str(input.name)) errors.name = copy.name;
  if (!EMAIL.test(str(input.email))) errors.email = copy.email;
  if (str(input.idea).length < 10) errors.idea = copy.idea;
  if (str(input.problem).length < 10) errors.problem = copy.problem;
  if (str(input.audience).length < 5) errors.audience = copy.audience;
  if (str(input.reach).length < 10) errors.reach = copy.reach;

  const link = str(input.link);
  if (link && !isWebUrl(link)) errors.link = copy.link;

  if (!str(input.team)) errors.team = copy.team;
  if (input.commitment !== true) errors.commitment = copy.commitment;

  return errors;
}
