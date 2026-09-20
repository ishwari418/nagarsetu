import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import mr from "@/locales/mr.json";
import bn from "@/locales/bn.json";
import te from "@/locales/te.json";
import ta from "@/locales/ta.json";
import kn from "@/locales/kn.json";
import gu from "@/locales/gu.json";
import ml from "@/locales/ml.json";
import pa from "@/locales/pa.json";

export const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

type Dict = Record<string, string>;

const DICTS: Record<string, Dict> = { en, hi, mr, bn, te, ta, kn, gu, ml, pa };

export const DEFAULT_LANGUAGE: LanguageCode = "en";

export function isLanguage(value: string): value is LanguageCode {
  return LANGUAGES.some((l) => l.code === value);
}

export function languageLabel(code: string) {
  return LANGUAGES.find((l) => l.code === code)?.native ?? "English";
}

/** Returns a translator that falls back to English, then to the key itself. */
export function translator(lang: string) {
  const dict = DICTS[lang] ?? DICTS.en;
  return (key: string) => dict[key] ?? DICTS.en[key] ?? key;
}

export type T = ReturnType<typeof translator>;
