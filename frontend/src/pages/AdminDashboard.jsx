import {
  useEffect,
  useState,
} from "react";

import axiosClient
  from "../api/axiosClient";

import {
  useLanguage,
} from "../i18n/LanguageContext";

const AdminDashboard = () => {
  const { t } =
    useLanguage();

  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadDashboard =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await axiosClient.get(
              "/admin/dashboard"
            );

          setData(
            response.data
              ?.data || null
          );
        } catch (error) {
          console.error(
            "ADMIN DASHBOARD ERROR:",
            error
          );

          setError(
            error.response?.data
              ?.message ||
              t(
                "dashboard.admin.loadError"
              )
          );
        } finally {
          setLoading(false);
        }
      };

    loadDashboard();
  }, []);

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
              "dashboard.admin.title"
            )}
          </h1>

          <p>
            {t(
              "dashboard.admin.description"
            )}
          </p>
        </div>
      </div>

      {/* METRICS */}

      <div className="metrics-grid">
        <MetricCard
          label={t(
            "dashboard.admin.totalTickets"
          )}
          value={
            loading
              ? "—"
              : data?.tickets
                  ?.total ?? 0
          }
        />

        <MetricCard
          label={t(
            "dashboard.admin.openTickets"
          )}
          value={
            loading
              ? "—"
              : data?.tickets
                  ?.open ?? 0
          }
        />

        <MetricCard
          label={t(
            "dashboard.admin.assets"
          )}
          value={
            loading
              ? "—"
              : data?.assets
                  ?.total ?? 0
          }
        />

        <MetricCard
          label={t(
            "dashboard.admin.assignedAssets"
          )}
          value={
            loading
              ? "—"
              : data?.assets
                  ?.assigned ?? 0
          }
        />

        <MetricCard
          label={t(
            "dashboard.admin.activeUsers"
          )}
          value={
            loading
              ? "—"
              : data?.users
                  ?.active ?? 0
          }
        />

        <MetricCard
          label={t(
            "dashboard.admin.averageRating"
          )}
          value={
            loading
              ? "—"
              : data?.ratings
                  ?.average_rating ??
                "0.00"
          }
        />
      </div>

      {/* STATUS PANELS */}

      <div className="dashboard-columns">
        {/* TICKETS */}

        <section className="content-panel">
          <div className="panel-heading">
            <div>
              <h2>
                {t(
                  "dashboard.admin.ticketStatus"
                )}
              </h2>

              <p>
                {t(
                  "dashboard.admin.ticketStatusDescription"
                )}
              </p>
            </div>
          </div>

          <div className="summary-list">
            <SummaryRow
              label={t(
                "dashboard.admin.open"
              )}
              value={
                data?.tickets
                  ?.open ?? 0
              }
            />

            <SummaryRow
              label={t(
                "dashboard.admin.assigned"
              )}
              value={
                data?.tickets
                  ?.assigned ?? 0
              }
            />

            <SummaryRow
              label={t(
                "dashboard.admin.inProgress"
              )}
              value={
                data?.tickets
                  ?.in_progress ?? 0
              }
            />

            <SummaryRow
              label={t(
                "dashboard.admin.waitingForUser"
              )}
              value={
                data?.tickets
                  ?.waiting_for_user ?? 0
              }
            />

            <SummaryRow
              label={t(
                "dashboard.admin.resolved"
              )}
              value={
                data?.tickets
                  ?.resolved ?? 0
              }
            />

            <SummaryRow
              label={t(
                "dashboard.admin.closed"
              )}
              value={
                data?.tickets
                  ?.closed ?? 0
              }
            />
          </div>
        </section>

        {/* ASSETS */}

        <section className="content-panel">
          <div className="panel-heading">
            <div>
              <h2>
                {t(
                  "dashboard.admin.assetStatus"
                )}
              </h2>

              <p>
                {t(
                  "dashboard.admin.assetStatusDescription"
                )}
              </p>
            </div>
          </div>

          <div className="summary-list">
            <SummaryRow
              label={t(
                "dashboard.admin.available"
              )}
              value={
                data?.assets
                  ?.available ?? 0
              }
            />

            <SummaryRow
              label={t(
                "dashboard.admin.assigned"
              )}
              value={
                data?.assets
                  ?.assigned ?? 0
              }
            />

            <SummaryRow
              label={t(
                "dashboard.admin.maintenance"
              )}
              value={
                data?.assets
                  ?.maintenance ?? 0
              }
            />

            <SummaryRow
              label={t(
                "dashboard.admin.retired"
              )}
              value={
                data?.assets
                  ?.retired ?? 0
              }
            />
          </div>
        </section>
      </div>
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
   SUMMARY ROW
===================================== */

const SummaryRow = ({
  label,
  value,
}) => {
  return (
    <div className="summary-row">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
};

export default AdminDashboard;