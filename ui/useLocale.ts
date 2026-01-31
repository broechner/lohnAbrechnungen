"use client";

import { useEffect, useState } from "react";
import type { Locale } from "./i18n";

export const useLocale = () => {
  const [locale, setLocale] = useState<Locale>("de");

  useEffect(() => {
    const stored = window.localStorage.getItem("laa-locale");
    if (stored === "de" || stored === "en") {
      setLocale(stored);
    }
  }, []);

  const updateLocale = (next: Locale) => {
    setLocale(next);
    window.localStorage.setItem("laa-locale", next);
  };

  return { locale, setLocale: updateLocale };
};
