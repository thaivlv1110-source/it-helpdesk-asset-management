import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axiosClient
  from "../api/axiosClient";

import {
  useAuth,
} from "../auth/AuthContext";

import {
  useLanguage,
} from "../i18n/LanguageContext";

const EmployeeDashboard = () => {
  const { user } =
    useAuth();

  const { t, language } =
    useLanguage();

  const navigate =
    useNavigate();

  const [tickets, setTickets] =
    useState([]);

  const [assets, setAssets] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadData =
      async () => {
        try {
          setLoading(true);
          setError("");

          const [
            ticketsResponse,
            assetsResponse,
          ] =
            await Promise.all([
              axiosClient.get(
                "/tickets/my"
              ),

              axiosClient.get(
                "/assets"
              ),
            ]);

          setTickets(
            ticketsResponse.data
              ?.data || []
          );

          setAssets(
            assetsResponse.data
              ?.data || []
          );
        } catch (error) {
          console.error(
            "EMPLOYEE DASHBOARD ERROR:",
            error
          );

          setError(
            error.response?.data
              ?.message ||
              t(
                "dashboard.employee.loadError"
              )
          );
        } finally {
          setLoading(false);
        }
      };

    loadData();
  }, []);

  const activeTickets =
    tickets.filter(
      (ticket) =>
        ticket.status !==
        "CLOSED"
    ).length;

  const closedTickets =
    tickets.filter(
      (ticket) =>
        ticket.status ===
        "CLOSED"
    ).length;

  const getGreeting = () => {
    if (language === "vi") {
      return `Xin chào, ${
        user?.fullName ||
        user?.full_name ||
        ""
      }`;
    }

    return `Good day, ${
      user?.fullName ||
      user?.full_name ||
      ""
    }`;
  };

  if (error) {
    return (
      <div className="page-error">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}

      <div className="page-heading">
        <div>
          <h1>
            {getGreeting()}
          </h1>

          <p>
            {t(
              "dashboard.employee.description"
            )}
          </p>
        </div>
      </div>

      {/* METRICS */}

      <div className="metrics-grid">
        <MetricCard
          label={t(
            "dashboard.employee.totalTickets"
          )}
          value={
            loading
              ? "—"
              : tickets.length
          }
        />

        <MetricCard
          label={t(
            "dashboard.employee.activeTickets"
          )}
          value={
            loading
              ? "—"
              : activeTickets
          }
        />

        <MetricCard
          label={t(
            "dashboard.employee.closedTickets"
          )}
          value={
            loading
              ? "—"
              : closedTickets
          }
        />

        <MetricCard
          label={t(
            "dashboard.employee.assignedAssets"
          )}
          value={
            loading
              ? "—"
              : assets.length
          }
        />
      </div>

      {/* RECENT TICKETS */}

      <section className="content-panel">
        <div className="panel-heading">
          <div>
            <h2>
              {t(
                "dashboard.employee.recentTickets"
              )}
            </h2>

            <p>
              {t(
                "dashboard.employee.recentTicketsDescription"
              )}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <p>
              {t(
                "common.loading"
              )}
            </p>
          </div>
        ) : tickets.length ===
          0 ? (
          <EmptyState
            title={t(
              "dashboard.employee.noTickets"
            )}
            text={t(
              "dashboard.employee.noTicketsDescription"
            )}
          />
        ) : (
          <div className="simple-list">
            {tickets
              .slice(0, 5)
              .map(
                (ticket) => (
                  <div
                    className="list-row"
                    key={
                      ticket.id
                    }
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      navigate(
                        `/tickets/${ticket.id}`
                      )
                    }
                    onKeyDown={(
                      event
                    ) => {
                      if (
                        event.key ===
                          "Enter" ||
                        event.key ===
                          " "
                      ) {
                        navigate(
                          `/tickets/${ticket.id}`
                        );
                      }
                    }}
                    style={{
                      cursor:
                        "pointer",
                    }}
                  >
                    <div>
                      <strong>
                        {
                          ticket.title
                        }
                      </strong>

                      <span>
                        {
                          ticket.ticket_code
                        }
                      </span>
                    </div>

                    <StatusBadge
                      status={
                        ticket.status
                      }
                      t={t}
                    />
                  </div>
                )
              )}
          </div>
        )}
      </section>
    </div>
  );
};

/* =====================================
   METRIC CARD
===================================== */

const MetricCard = ({
  label,
  value,
}) => {
  return (
    <div className="metric-card">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
};

/* =====================================
   STATUS BADGE
===================================== */

const StatusBadge = ({
  status,
  t,
}) => {
  return (
    <span
      className={`status-badge status-${status
        ?.toLowerCase()
        .replaceAll(
          "_",
          "-"
        )}`}
    >
      {t(
        `tickets.statuses.${status}`
      )}
    </span>
  );
};

/* =====================================
   EMPTY STATE
===================================== */

const EmptyState = ({
  title,
  text,
}) => {
  return (
    <div className="empty-state">
      <strong>
        {title}
      </strong>

      <p>
        {text}
      </p>
    </div>
  );
};

export default EmployeeDashboard;