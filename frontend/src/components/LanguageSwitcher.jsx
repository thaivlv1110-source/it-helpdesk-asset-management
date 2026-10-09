import {
  useLanguage,
} from "../i18n/LanguageContext";

const LanguageSwitcher = () => {
  const {
    language,
    setLanguage,
    t,
  } = useLanguage();

  return (
    <div
      className="language-switcher"
      aria-label={t(
        "common.language"
      )}
    >
      <span
        className="language-icon"
        aria-hidden="true"
      >
        🌐
      </span>

      <button
        type="button"
        className={
          language === "en"
            ? "language-option active"
            : "language-option"
        }
        onClick={() =>
          setLanguage("en")
        }
        aria-pressed={
          language === "en"
        }
        title={t(
          "common.english"
        )}
      >
        EN
      </button>

      <span
        className="language-divider"
        aria-hidden="true"
      >
        /
      </span>

      <button
        type="button"
        className={
          language === "vi"
            ? "language-option active"
            : "language-option"
        }
        onClick={() =>
          setLanguage("vi")
        }
        aria-pressed={
          language === "vi"
        }
        title={t(
          "common.vietnamese"
        )}
      >
        VI
      </button>
    </div>
  );
};

export default LanguageSwitcher;