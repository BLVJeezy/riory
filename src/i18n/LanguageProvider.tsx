import { createContext, useContext, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLangFromPath, stripLangPrefix, withLangPrefix, type Language } from "./config";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  localizedPath: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const lang = useMemo(() => getLangFromPath(location.pathname), [location.pathname]);

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
    document.documentElement.lang = lang;
  }, [lang, i18n]);

  const setLang = (newLang: Language) => {
    const basePath = stripLangPrefix(location.pathname);
    const newPath = withLangPrefix(basePath, newLang) + location.search + location.hash;
    navigate(newPath);
  };

  const localizedPath = (path: string) => withLangPrefix(path, lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, localizedPath }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
