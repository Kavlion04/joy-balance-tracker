import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Lang, t as dict } from "@/lib/i18n";

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dict) => string;
}

const I18nCtx = createContext<Ctx>({ lang: "ru", setLang: () => {}, t: (k) => String(k) });

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const stored = localStorage.getItem("app_lang");
    return (stored === "ru" || stored === "uz" || stored === "en") ? stored : "ru";
  });

  useEffect(() => { localStorage.setItem("app_lang", lang); }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const t = (key: keyof typeof dict) => dict[key]?.[lang] ?? String(key);

  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
};

export const useI18n = () => useContext(I18nCtx);
