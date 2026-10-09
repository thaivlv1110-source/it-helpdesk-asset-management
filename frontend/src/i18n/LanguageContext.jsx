import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import translations from "./translations";

const LanguageContext =
  createContext(null);

const DEFAULT_LANGUAGE = "en";

const SUPPORTED_LANGUAGES = [
  "en",
  "vi",
];

export const LanguageProvider = ({
  children,
}) => {
  const [
    language,
    setLanguageState,
  ] = useState(() => {
    const savedLanguage =
      localStorage.getItem(
        "language"
      );

    if (
      SUPPORTED_LANGUAGES.includes(
        savedLanguage
      )
    ) {
      return savedLanguage;
    }

    return DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    document.documentElement.lang =
      language;
  }, [language]);

  const setLanguage = (
    newLanguage
  ) => {
    if (
      !SUPPORTED_LANGUAGES.includes(
        newLanguage
      )
    ) {
      return;
    }

    localStorage.setItem(
      "language",
      newLanguage
    );

    setLanguageState(
      newLanguage
    );
  };

  const t = (key) => {
    const parts =
      key.split(".");

    let value =
      translations[language];

    for (const part of parts) {
      value =
        value?.[part];

      if (
        value === undefined
      ) {
        return key;
      }
    }

    return value;
  };

  const contextValue =
    useMemo(
      () => ({
        language,
        setLanguage,
        t,
      }),
      [language]
    );

  return (
    <LanguageContext.Provider
      value={contextValue}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context =
    useContext(
      LanguageContext
    );

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
};