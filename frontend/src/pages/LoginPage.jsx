import {
  useState,
} from "react";

import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../auth/AuthContext";

import {
  useLanguage,
} from "../i18n/LanguageContext";

import LanguageSwitcher
  from "../components/LanguageSwitcher";

import "./LoginPage.css";

const LoginPage = () => {
  const {
    user,
    login,
  } = useAuth();

  const {
    t,
  } = useLanguage();

  const navigate =
    useNavigate();

  const [
    form,
    setForm,
  ] = useState({
    email: "",
    password: "",
  });

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  if (user) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    if (error) {
      setError("");
    }
  };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      if (loading) {
        return;
      }

      setError("");
      setLoading(true);

      try {
        await login(form);

        navigate("/");
      } catch (error) {
        const backendMessage =
          error.response
            ?.data
            ?.message;

        if (
          backendMessage ===
          "Invalid email or password"
        ) {
          setError(
            t(
              "auth.errors.invalidCredentials"
            )
          );
        } else if (
          backendMessage ===
            "Account is inactive" ||
          backendMessage ===
            "User account is inactive"
        ) {
          setError(
            t(
              "auth.errors.inactiveAccount"
            )
          );
        } else if (
          !error.response
        ) {
          setError(
            t(
              "auth.errors.network"
            )
          );
        } else {
          setError(
            t(
              "auth.errors.generic"
            )
          );
        }
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="login-page">
      <div className="login-layout">

        <section className="login-information">

          <div className="login-brand">
            <div className="login-logo">
              IT
            </div>

            <div>
              <strong>
                {t(
                  "auth.brandName"
                )}
              </strong>

              <span>
                {t(
                  "auth.brandSubtitle"
                )}
              </span>
            </div>
          </div>

          <div className="login-copy">
            <p className="login-eyebrow">
              {t(
                "auth.internalSystem"
              )}
            </p>

            <h1>
              {t(
                "auth.heroTitle"
              )}
            </h1>

            <p className="login-description">
              {t(
                "auth.heroDescription"
              )}
            </p>
          </div>

          <div className="login-footer">
            {t(
              "auth.organization"
            )}
          </div>

        </section>

        <section className="login-form-panel">

          <div className="login-language">
            <LanguageSwitcher />
          </div>

          <div className="login-form-wrapper">

            <div className="login-heading">
              <h2>
                {t(
                  "auth.signInTitle"
                )}
              </h2>

              <p>
                {t(
                  "auth.signInDescription"
                )}
              </p>
            </div>

            {error && (
              <div
                className="form-error"
                role="alert"
              >
                {error}
              </div>
            )}

            <form
              className="login-form"
              onSubmit={
                handleSubmit
              }
              noValidate
            >

              <div className="form-field">
                <label htmlFor="email">
                  {t(
                    "auth.emailLabel"
                  )}
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={
                    form.email
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={t(
                    "auth.emailPlaceholder"
                  )}
                  autoComplete="email"
                  disabled={
                    loading
                  }
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="password">
                  {t(
                    "auth.passwordLabel"
                  )}
                </label>

                <div className="password-input">
                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      form.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder={t(
                      "auth.passwordPlaceholder"
                    )}
                    autoComplete="current-password"
                    disabled={
                      loading
                    }
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    disabled={
                      loading
                    }
                  >
                    {showPassword
                      ? t(
                          "auth.hidePassword"
                        )
                      : t(
                          "auth.showPassword"
                        )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="login-submit"
                disabled={
                  loading
                }
              >
                {loading && (
                  <span
                    className="login-spinner"
                    aria-hidden="true"
                  />
                )}

                <span>
                  {loading
                    ? t(
                        "auth.signingIn"
                      )
                    : t(
                        "auth.signInButton"
                      )}
                </span>
              </button>

            </form>

            <p className="login-help">
              {t(
                "auth.supportHint"
              )}
            </p>

          </div>
        </section>

      </div>
    </div>
  );
};

export default LoginPage;