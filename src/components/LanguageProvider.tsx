"use client";

import { createContext, useContext, useMemo } from "react";
import { translator, DEFAULT_LANGUAGE } from "@/lib/i18n";

const LanguageContext = createContext<string>(DEFAULT_LANGUAGE);

export function LanguageProvider({ lang, children }: { lang: string; children: React.ReactNode }) {
  return <LanguageContext.Provider value={lang}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useT() {
  const lang = useLanguage();
  return useMemo(() => translator(lang), [lang]);
}
