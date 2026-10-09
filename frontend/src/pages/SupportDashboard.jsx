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

const SupportDashboard = () => {
  const { user } =
    useAuth();

  const { t, language } =
    useLanguage();

  const navigate =
    useNavigate();

  const [tickets, setTickets] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadQueue =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await axiosClient.get(
              "/support/tickets"
            );

          setTickets(
            response.data
              ?.data || []
          );
        } catch (error) {
          console.error(
            "SUPPORT DASHBOARD ERROR:",
            error
          );

          setError(
            error.response?.data
              ?.message ||
              t(
                "dashboard.support.loadError"
              )
          );
        } finally {
          setLoading(false);
        }
      };

    loadQueue();
  }, []);

  const countByStatus =
    (status) =>
      tickets.filter(
        (ticket) =>
          ticket.status ===
          status
      ).length;

  const supportName =
    user?.fullName ||
    user?.full_name ||
    "";

  const getDescription =
    () => {
      if (language === "vi") {
        return supportName
          ? `Các yêu cầu hỗ trợ hiện đang được giao cho ${supportName}.`
          : t(
              "dashboard.support.description"
            );
      }

      return supportName
        ? `Tickets currently assigned to ${supportName}.`
        : t(
            "dashboard.support.description"
          );
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
            {t(
              "dashboard.support.title"
            )}
          </h1>

          <p>
            {getDescription()}
          </p>
        </div>
      </div>

      {/* METRICS */}

      <div className="metrics-grid">
        <MetricCard
          label={t(
            "dashboard.support.assigned"
          )}
          value={
            loading
              ? "—"
              : countByStatus(
                  "ASSIGNED"
                )
          }
        />

        <MetricCard
          label={t(
            "dashboard.support.inProgress"
          )}
          value={
            loading
              ? "—"
              : countByStatus(
                  "IN_PROGRESS"
                )
          }
        />

        <MetricCard
          label={t(
            "dashboard.support.waiting"
          )}
          value={
            loading
              ? "—"
              : countByStatus(
                  "WAITING_FOR_USER"
                )
          }
        />

        <MetricCard
          label={t(
            "dashboard.support.resolved"
          )}
          value={
            loading
              ? "—"
              : countByStatus(
                  "RESOLVED"
                )
          }
        />
      </div>

      {/* CURRENT QUEUE */}

      <section className="content-panel">
        <div className="panel-heading">
          <div>
            <h2>
              {t(
                "dashboard.support.currentQueue"
              )}
            </h2>

            <p>
              {t(
                "dashboard.support.currentQueueDescription"
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
          <div className="empty-state">
            <strong>
              {t(
                "dashboard.support.clearQueue"
              )}
            </strong>

            <p>
              {t(
                "dashboard.support.clearQueueDescription"
              )}
            </p>
          </div>
        ) : (
          <div className="simple-list">
            {tickets.map(
              (ticket) => (
                <div
                  key={
                    ticket.id
                  }
                  className="list-row"
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

                      {" · "}

                      {t(
                        `tickets.priorities.${ticket.priority}`
                      )}
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

export default SupportDashboard;