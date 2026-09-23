import { createContext, useContext, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLangFromPath, withLangPrefix, type Language } from "./config";
import { getLocalizedPath, getLocalizedRoutes } from "./routeLocalization";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  localizedPath: (path: string) => string;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const lang = useMemo(() => getLangFromPath(location.pathname), [location.pathname]);
  const availableLanguages = useMemo(() => {
    const routes = getLocalizedRoutes(location.pathname);
    return routes.length > 0 ? routes.map(({ language }) => language) : [lang];
  }, [lang, location.pathname]);

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
    document.documentElement.lang = lang;
  }, [lang, i18n]);

  const setLang = (newLang: Language) => {
    const localizedRoute = getLocalizedPath(location.pathname, newLang);
    if (!localizedRoute) return;
    const newPath = localizedRoute + location.search + location.hash;
    navigate(newPath);
  };

  const localizedPath = (path: string) => {
    const sameLanguagePath = getLocalizedPath(path, lang);
    if (sameLanguagePath) return sameLanguagePath;

    // A single-language destination should always point to its canonical path.
    const canonicalPath = getLocalizedRoutes(path)[0]?.path;
    return canonicalPath ?? withLangPrefix(path, lang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, localizedPath, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
