import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import axiosClient from "../api/axiosClient";

import {
  useAuth,
} from "../auth/AuthContext";

import {
  useLanguage,
} from "../i18n/LanguageContext";

const AssetDetailPage = () => {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const { user } =
    useAuth();

  const { t } =
    useLanguage();

  const [asset, setAsset] =
    useState(null);

  const [
    history,
    setHistory,
  ] = useState([]);

  const [
    employees,
    setEmployees,
  ] = useState([]);

  const [
    assigneeId,
    setAssigneeId,
  ] = useState("");

  const [
    assignNote,
    setAssignNote,
  ] = useState("");

  const [
    returnNote,
    setReturnNote,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const isAdmin =
    user?.role === "ADMIN";

  /* =====================================
     LOAD
  ===================================== */

  const loadAsset =
    async () => {
      const response =
        await axiosClient.get(
          `/assets/${id}`
        );

      setAsset(
        response.data?.data ||
          null
      );
    };

  const loadHistory =
    async () => {
      const response =
        await axiosClient.get(
          `/assets/${id}/history`
        );

      setHistory(
        response.data?.data ||
          []
      );
    };

  const loadEmployees =
    async () => {
      if (!isAdmin) {
        return;
      }

      const response =
        await axiosClient.get(
          "/admin/users"
        );

      const users =
        response.data?.data ||
        response.data ||
        [];

      setEmployees(
        users.filter(
          (item) => {
            const role =
              item.role ||
              item.role_name;

            const active =
              item.is_active ??
              item.isActive ??
              true;

            return (
              role ===
                "EMPLOYEE" &&
              active === true
            );
          }
        )
      );
    };

  const loadPage =
    async () => {
      try {
        setLoading(true);
        setError("");

        await Promise.all([
          loadAsset(),
          loadHistory(),
          loadEmployees(),
        ]);
      } catch (error) {
        console.error(
          "LOAD ASSET DETAIL ERROR:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            t(
              "assets.detail.loadError"
            )
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadPage();
  }, [
    id,
    user?.role,
  ]);

  /* =====================================
     ASSIGN
  ===================================== */

  const handleAssign =
    async () => {
      if (!assigneeId) {
        return;
      }

      try {
        setSaving(true);
        setError("");
        setSuccess("");

        await axiosClient.post(
          `/assets/${id}/assign`,
          {
            assigneeId:
              Number(
                assigneeId
              ),

            note:
              assignNote.trim() ||
              null,
          }
        );

        setAssigneeId("");
        setAssignNote("");

        setSuccess(
          t(
            "assets.assign.success"
          )
        );

        await Promise.all([
          loadAsset(),
          loadHistory(),
        ]);
      } catch (error) {
        console.error(
          "ASSIGN ASSET ERROR:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            t(
              "assets.assign.error"
            )
        );
      } finally {
        setSaving(false);
      }
    };

  /* =====================================
     RETURN
  ===================================== */

  const handleReturn =
    async () => {
      try {
        setSaving(true);
        setError("");
        setSuccess("");

        await axiosClient.post(
          `/assets/${id}/return`,
          {
            note:
              returnNote.trim() ||
              null,
          }
        );

        setReturnNote("");

        setSuccess(
          t(
            "assets.return.success"
          )
        );

        await Promise.all([
          loadAsset(),
          loadHistory(),
        ]);
      } catch (error) {
        console.error(
          "RETURN ASSET ERROR:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            t(
              "assets.return.error"
            )
        );
      } finally {
        setSaving(false);
      }
    };

  if (loading) {
    return (
      <div className="empty-state">
        <p>
          {t(
            "common.loading"
          )}
        </p>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="page-error">
        {t(
          "assets.detail.loadError"
        )}
      </div>
    );
  }

  return (
    <div className="asset-detail-page">
      <button
        type="button"
        className="asset-detail-back"
        onClick={() =>
          navigate(
            "/assets"
          )
        }
      >
        ←{" "}
        {t(
          "assets.detail.back"
        )}
      </button>

      <div className="asset-detail-header">
        <div>
          <div className="asset-detail-code">
            {
              asset.asset_code
            }
          </div>

          <h1>
            {
              asset.asset_name
            }
          </h1>

          <p>
            {asset.brand ||
              "-"}
            {" · "}
            {asset.model ||
              "-"}
          </p>
        </div>

        <AssetStatus
          status={
            asset.status
          }
          t={t}
        />
      </div>

      {success && (
        <div className="page-success">
          {success}
        </div>
      )}

      {error && (
        <div className="page-error">
          {error}
        </div>
      )}

      <div className="asset-detail-grid">
        <main className="asset-detail-main">
          {/* INFORMATION */}

          <section className="detail-card">
            <div className="detail-card-header">
              <h2>
                {t(
                  "assets.detail.information"
                )}
              </h2>
            </div>

            <div className="asset-information-grid">
              <InfoItem
                label={t(
                  "assets.category"
                )}
                value={
                  asset.category
                }
              />

              <InfoItem
                label={t(
                  "assets.location"
                )}
                value={
                  asset.location ||
                  "-"
                }
              />

              <InfoItem
                label={t(
                  "assets.brand"
                )}
                value={
                  asset.brand ||
                  "-"
                }
              />

              <InfoItem
                label={t(
                  "assets.model"
                )}
                value={
                  asset.model ||
                  "-"
                }
              />

              <InfoItem
                label={t(
                  "assets.serialNumber"
                )}
                value={
                  asset.serial_number ||
                  "-"
                }
              />

              <InfoItem
                label={t(
                  "assets.purchaseDate"
                )}
                value={formatDate(
                  asset.purchase_date
                )}
              />

              <InfoItem
                label={t(
                  "assets.warrantyExpiration"
                )}
                value={formatDate(
                  asset.warranty_expiration
                )}
              />

              <InfoItem
                label={t(
                  "assets.assignedTo"
                )}
                value={
                  asset.assigned_to_name ||
                  "-"
                }
              />
            </div>

            {asset.notes && (
              <div className="asset-notes">
                <strong>
                  {t(
                    "assets.notes"
                  )}
                </strong>

                <p>
                  {
                    asset.notes
                  }
                </p>
              </div>
            )}
          </section>

          {/* HISTORY */}

          <section className="detail-card">
            <div className="detail-card-header">
              <h2>
                {t(
                  "assets.detail.assignmentHistory"
                )}
              </h2>
            </div>

            {history.length ===
            0 ? (
              <div className="detail-empty">
                {t(
                  "assets.detail.noHistory"
                )}
              </div>
            ) : (
              <div className="asset-history-list">
                {history.map(
                  (item) => (
                    <div
                      className="asset-history-item"
                      key={
                        item.id
                      }
                    >
                      <div>
                        <strong>
                          {item.assigned_to_name}
                        </strong>

                        <span>
                          {
                            item.assigned_to_email
                          }
                        </span>
                      </div>

                      <div>
                        <span>
                          {t(
                            "assets.detail.assignedDate"
                          )}
                        </span>

                        <strong>
                          {formatDateTime(
                            item.assigned_at
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          {t(
                            "assets.detail.returnedDate"
                          )}
                        </span>

                        <strong>
                          {item.returned_at
                            ? formatDateTime(
                                item.returned_at
                              )
                            : "-"}
                        </strong>
                      </div>

                      <div>
                        <span>
                          {t(
                            "assets.detail.assignedBy"
                          )}
                        </span>

                        <strong>
                          {item.assigned_by_name ||
                            "-"}
                        </strong>
                      </div>

                      {item.note && (
                        <p>
                          {
                            item.note
                          }
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </section>
        </main>

        {/* SIDEBAR */}

        <aside className="asset-detail-sidebar">
          {isAdmin &&
            asset.status ===
              "AVAILABLE" && (
              <section className="detail-card">
                <div className="detail-card-header">
                  <h2>
                    {t(
                      "assets.assign.title"
                    )}
                  </h2>
                </div>

                <div className="detail-action-panel">
                  <label>
                    {t(
                      "assets.assign.selectEmployee"
                    )}
                  </label>

                  <select
                    value={
                      assigneeId
                    }
                    onChange={(
                      event
                    ) =>
                      setAssigneeId(
                        event.target
                          .value
                      )
                    }
                  >
                    <option value="">
                      --
                    </option>

                    {employees.map(
                      (
                        employee
                      ) => (
                        <option
                          key={
                            employee.id
                          }
                          value={
                            employee.id
                          }
                        >
                          {employee.full_name ||
                            employee.fullName}
                          {" · "}
                          {
                            employee.email
                          }
                        </option>
                      )
                    )}
                  </select>

                  <label>
                    {t(
                      "assets.assign.note"
                    )}
                  </label>

                  <textarea
                    rows={4}
                    value={
                      assignNote
                    }
                    onChange={(
                      event
                    ) =>
                      setAssignNote(
                        event.target
                          .value
                      )
                    }
                    placeholder={t(
                      "assets.assign.notePlaceholder"
                    )}
                  />

                  <button
                    type="button"
                    className="button-primary"
                    disabled={
                      saving ||
                      !assigneeId
                    }
                    onClick={
                      handleAssign
                    }
                  >
                    {saving
                      ? t(
                          "assets.assign.assigning"
                        )
                      : t(
                          "assets.assign.assignButton"
                        )}
                  </button>
                </div>
              </section>
            )}

          {isAdmin &&
            asset.status ===
              "ASSIGNED" && (
              <section className="detail-card">
                <div className="detail-card-header">
                  <h2>
                    {t(
                      "assets.return.title"
                    )}
                  </h2>
                </div>

                <div className="detail-action-panel">
                  <div className="asset-current-user">
                    <span>
                      {t(
                        "assets.assignedTo"
                      )}
                    </span>

                    <strong>
                      {asset.assigned_to_name ||
                        "-"}
                    </strong>

                    <small>
                      {asset.assigned_to_email ||
                        ""}
                    </small>
                  </div>

                  <label>
                    {t(
                      "assets.return.note"
                    )}
                  </label>

                  <textarea
                    rows={4}
                    value={
                      returnNote
                    }
                    onChange={(
                      event
                    ) =>
                      setReturnNote(
                        event.target
                          .value
                      )
                    }
                    placeholder={t(
                      "assets.return.notePlaceholder"
                    )}
                  />

                  <button
                    type="button"
                    className="button-primary"
                    disabled={
                      saving
                    }
                    onClick={
                      handleReturn
                    }
                  >
                    {saving
                      ? t(
                          "assets.return.returning"
                        )
                      : t(
                          "assets.return.returnButton"
                        )}
                  </button>
                </div>
              </section>
            )}
        </aside>
      </div>
    </div>
  );
};

const InfoItem = ({
  label,
  value,
}) => (
  <div className="asset-info-item">
    <span>
      {label}
    </span>

    <strong>
      {value || "-"}
    </strong>
  </div>
);

const AssetStatus = ({
  status,
  t,
}) => {
  if (!status) {
    return "-";
  }

  const className =
    status
      .toLowerCase()
      .replaceAll(
        "_",
        "-"
      );

  return (
    <span
      className={`status-pill asset-status-${className}`}
    >
      {t(
        `assets.statuses.${status}`
      )}
    </span>
  );
};

const formatDate = (
  value
) => {
  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return new Intl.DateTimeFormat(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  ).format(date);
};

const formatDateTime = (
  value
) => {
  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  return new Intl.DateTimeFormat(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",

      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
};

export default AssetDetailPage;