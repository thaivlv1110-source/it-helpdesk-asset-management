import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../auth/AuthContext";

import {
  useLanguage,
} from "../i18n/LanguageContext";

import LanguageSwitcher
  from "./LanguageSwitcher";

const getInitials = (
  name = ""
) => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map(
      (word) =>
        word[0]
    )
    .join("")
    .toUpperCase();
};

const AppLayout = () => {
  const {
    user,
    logout,
  } = useAuth();

  const {
    t,
  } = useLanguage();

  const navigate =
    useNavigate();

  const handleLogout =
    () => {
      logout();

      navigate(
        "/login"
      );
    };

  const getRoleLabel =
    () => {
      if (
        user?.role ===
        "ADMIN"
      ) {
        return t(
          "roles.admin"
        );
      }

      if (
        user?.role ===
        "IT_SUPPORT"
      ) {
        return t(
          "roles.itSupport"
        );
      }

      return t(
        "roles.employee"
      );
    };

  const navClassName =
    ({ isActive }) =>
      isActive
        ? "nav-item active"
        : "nav-item";

  return (
    <div className="app-shell">

      <aside className="app-sidebar">

        <div className="sidebar-header">
          <div className="sidebar-logo">
            IT
          </div>

          <div className="sidebar-brand">
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

        <div className="sidebar-section-label">
          {t(
            "navigation.workspace"
          )}
        </div>

        <nav className="sidebar-navigation">

          <NavLink
            to="/"
            end
            className={
              navClassName
            }
          >
            {t(
              "navigation.dashboard"
            )}
          </NavLink>

          {user?.role ===
            "EMPLOYEE" && (
            <>
              <NavLink
                to="/tickets"
                className={
                  navClassName
                }
              >
                {t(
                  "navigation.myTickets"
                )}
              </NavLink>

              <NavLink
                to="/assets"
                className={
                  navClassName
                }
              >
                {t(
                  "navigation.myAssets"
                )}
              </NavLink>
            </>
          )}

          {user?.role ===
            "IT_SUPPORT" && (
            <>
              <NavLink
                to="/support/tickets"
                className={
                  navClassName
                }
              >
                {t(
                  "navigation.supportQueue"
                )}
              </NavLink>

              <NavLink
                to="/assets"
                className={
                  navClassName
                }
              >
                {t(
                  "navigation.assets"
                )}
              </NavLink>
            </>
          )}

          {user?.role ===
            "ADMIN" && (
            <>
              <NavLink
                to="/tickets"
                className={
                  navClassName
                }
              >
                {t(
                  "navigation.tickets"
                )}
              </NavLink>

              <NavLink
                to="/assets"
                className={
                  navClassName
                }
              >
                {t(
                  "navigation.assets"
                )}
              </NavLink>

              <NavLink
                to="/admin/users"
                className={
                  navClassName
                }
              >
                {t(
                  "navigation.users"
                )}
              </NavLink>
            </>
          )}

        </nav>

        <div className="sidebar-account">

          <div className="account-avatar">
            {getInitials(
              user?.fullName
            )}
          </div>

          <div className="account-info">
            <strong>
              {user?.fullName}
            </strong>

            <span>
              {getRoleLabel()}
            </span>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={
              handleLogout
            }
          >
            {t(
              "common.logout"
            )}
          </button>

        </div>

      </aside>

      <div className="app-content">

        <header className="topbar">

          <span className="topbar-product">
            {t(
              "navigation.internalPortal"
            )}
          </span>

          <div className="topbar-actions">

            <LanguageSwitcher />

            <span className="topbar-user">
              {user?.email}
            </span>

          </div>

        </header>

        <main className="page-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default AppLayout;