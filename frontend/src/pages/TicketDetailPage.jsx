import {
  useEffect,
  useMemo,
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

const TicketDetailPage = () => {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const { user } =
    useAuth();

  const { t } =
    useLanguage();

  const [ticket, setTicket] =
    useState(null);

  const [
    comments,
    setComments,
  ] = useState([]);

  const [
    history,
    setHistory,
  ] = useState([]);

  const [
    rating,
    setRating,
  ] = useState(null);

  const [
    supportUsers,
    setSupportUsers,
  ] = useState([]);

  const [
    selectedSupport,
    setSelectedSupport,
  ] = useState("");

  const [
    commentText,
    setCommentText,
  ] = useState("");

  const [
    statusNote,
    setStatusNote,
  ] = useState("");

  const [
    ratingScore,
    setRatingScore,
  ] = useState("5");

  const [
    ratingComment,
    setRatingComment,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const isAdmin =
    user?.role === "ADMIN";

  const isEmployee =
    user?.role ===
    "EMPLOYEE";

  const isSupport =
    user?.role ===
    "IT_SUPPORT";

  /* =====================================
     LOAD TICKET
  ===================================== */

  const loadTicket =
    async () => {
      const response =
        await axiosClient.get(
          `/tickets/${id}`
        );

      setTicket(
        response.data?.data ||
          null
      );
    };

  /* =====================================
     COMMENTS
  ===================================== */

  const loadComments =
    async () => {
      const response =
        await axiosClient.get(
          `/tickets/${id}/comments`
        );

      setComments(
        response.data?.data ||
          []
      );
    };

  /* =====================================
     HISTORY
  ===================================== */

  const loadHistory =
    async () => {
      const response =
        await axiosClient.get(
          `/tickets/${id}/history`
        );

      setHistory(
        response.data?.data ||
          []
      );
    };

  /* =====================================
     RATING
  ===================================== */

  const loadRating =
    async () => {
      const response =
        await axiosClient.get(
          `/tickets/${id}/rating`
        );

      setRating(
        response.data?.data ||
          null
      );
    };

  /* =====================================
     SUPPORT USERS
  ===================================== */

  const loadSupportUsers =
    async () => {
      if (!isAdmin) {
        return;
      }

      const response =
        await axiosClient.get(
          "/admin/users"
        );

      const allUsers =
        response.data?.data ||
        response.data ||
        [];

      const supportOnly =
        allUsers.filter(
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
                "IT_SUPPORT" &&
              active === true
            );
          }
        );

      setSupportUsers(
        supportOnly
      );
    };

  /* =====================================
     LOAD PAGE
  ===================================== */

  const loadPage =
    async () => {
      try {
        setLoading(true);
        setError("");

        await loadTicket();

        const requests = [
          loadComments(),
          loadHistory(),
          loadRating(),
        ];

        if (isAdmin) {
          requests.push(
            loadSupportUsers()
          );
        }

        await Promise.all(
          requests
        );
      } catch (error) {
        console.error(
          "LOAD TICKET DETAIL ERROR:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            t(
              "tickets.detail.loadError"
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
     ASSIGN SUPPORT
  ===================================== */

  const handleAssign =
    async () => {
      if (
        !selectedSupport
      ) {
        return;
      }

      try {
        setSaving(true);
        setError("");
        setSuccess("");

        await axiosClient.post(
          `/tickets/${id}/assign`,
          {
            assigneeId:
              Number(
                selectedSupport
              ),
          }
        );

        setSelectedSupport(
          ""
        );

        setSuccess(
          t(
            "tickets.assign.success"
          )
        );

        await Promise.all([
          loadTicket(),
          loadHistory(),
        ]);
      } catch (error) {
        console.error(
          "ASSIGN TICKET ERROR:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            t(
              "tickets.assign.error"
            )
        );
      } finally {
        setSaving(false);
      }
    };

  /* =====================================
     STATUS
  ===================================== */

  const updateStatus =
    async (
      newStatus
    ) => {
      try {
        setSaving(true);
        setError("");
        setSuccess("");

        await axiosClient.patch(
          `/tickets/${id}/status`,
          {
            status:
              newStatus,

            note:
              statusNote.trim() ||
              undefined,
          }
        );

        setStatusNote("");

        setSuccess(
          t(
            "tickets.updateStatus.success"
          )
        );

        await Promise.all([
          loadTicket(),
          loadHistory(),
        ]);
      } catch (error) {
        console.error(
          "UPDATE STATUS ERROR:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            t(
              "tickets.updateStatus.error"
            )
        );
      } finally {
        setSaving(false);
      }
    };

  /* =====================================
     COMMENT
  ===================================== */

  const handleComment =
    async (event) => {
      event.preventDefault();

      if (
        !commentText.trim()
      ) {
        return;
      }

      try {
        setSaving(true);
        setError("");

        await axiosClient.post(
          `/tickets/${id}/comments`,
          {
            content:
              commentText.trim(),
          }
        );

        setCommentText("");

        await loadComments();
      } catch (error) {
        console.error(
          "ADD COMMENT ERROR:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            "Unable to add comment"
        );
      } finally {
        setSaving(false);
      }
    };

  /* =====================================
     RATING
  ===================================== */

  const handleRating =
    async (event) => {
      event.preventDefault();

      try {
        setSaving(true);
        setError("");
        setSuccess("");

        await axiosClient.post(
          `/tickets/${id}/rating`,
          {
            rating:
              Number(
                ratingScore
              ),

            comment:
              ratingComment.trim(),
          }
        );

        setRatingComment("");

        setSuccess(
          t(
            "tickets.rating.success"
          )
        );

        await loadRating();
      } catch (error) {
        console.error(
          "CREATE RATING ERROR:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            t(
              "tickets.rating.error"
            )
        );
      } finally {
        setSaving(false);
      }
    };

  /* =====================================
     SUPPORT ACTIONS
  ===================================== */

  const supportActions =
    useMemo(() => {
      if (
        !isSupport ||
        !ticket
      ) {
        return [];
      }

      if (
        ticket.status ===
        "ASSIGNED"
      ) {
        return [
          {
            value:
              "IN_PROGRESS",

            label:
              t(
                "tickets.statusActions.start"
              ),
          },
        ];
      }

      if (
        ticket.status ===
        "IN_PROGRESS"
      ) {
        return [
          {
            value:
              "WAITING_FOR_USER",

            label:
              t(
                "tickets.statusActions.waiting"
              ),
          },

          {
            value:
              "RESOLVED",

            label:
              t(
                "tickets.statusActions.resolve"
              ),
          },
        ];
      }

      if (
        ticket.status ===
        "WAITING_FOR_USER"
      ) {
        return [
          {
            value:
              "IN_PROGRESS",

            label:
              t(
                "tickets.statusActions.resume"
              ),
          },
        ];
      }

      return [];
    }, [
      isSupport,
      ticket,
      t,
    ]);

  /* =====================================
     LOADING
  ===================================== */

  if (loading) {
    return (
      <div className="ticket-detail-loading">
        <div className="tickets-loader" />

        <p>
          {t(
            "common.loading"
          )}
        </p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="page-error">
        {t(
          "tickets.detail.loadError"
        )}
      </div>
    );
  }

  return (
    <div className="ticket-detail-page">
      {/* BACK */}

      <button
        type="button"
        className="ticket-detail-back"
        onClick={() =>
          navigate(
            "/tickets"
          )
        }
      >
        ←{" "}
        {t(
          "tickets.detail.back"
        )}
      </button>

      {/* HEADER */}

      <div className="ticket-detail-header">
        <div>
          <div className="ticket-detail-code">
            {
              ticket.ticket_code
            }
          </div>

          <h1>
            {ticket.title}
          </h1>

          <p>
            {t(
              "tickets.detail.createdAt"
            )}
            :{" "}
            {formatDateTime(
              ticket.created_at
            )}
          </p>
        </div>

        <TicketStatus
          status={
            ticket.status
          }
          t={t}
        />
      </div>

      {/* MESSAGES */}

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

      <div className="ticket-detail-layout">
        {/* ==========================
            MAIN
        ========================== */}

        <main className="ticket-detail-main">
          {/* DESCRIPTION */}

          <section className="detail-card">
            <div className="detail-card-header">
              <h2>
                {t(
                  "tickets.detail.description"
                )}
              </h2>
            </div>

            <div className="detail-card-body ticket-description">
              {
                ticket.description
              }
            </div>
          </section>

          {/* COMMENTS */}

          <section className="detail-card">
            <div className="detail-card-header">
              <h2>
                {t(
                  "tickets.detail.comments"
                )}
              </h2>

              <span>
                {
                  comments.length
                }
              </span>
            </div>

            <div className="comment-list">
              {comments.length ===
              0 ? (
                <div className="detail-empty">
                  {t(
                    "common.noData"
                  )}
                </div>
              ) : (
                comments.map(
                  (comment) => (
                    <div
                      key={
                        comment.id
                      }
                      className="comment-item"
                    >
                      <div className="comment-avatar">
                        {getInitials(
                          comment.full_name
                        )}
                      </div>

                      <div className="comment-content">
                        <div className="comment-meta">
                          <strong>
                            {comment.full_name ||
                              "-"}
                          </strong>

                          <span>
                            {
                              comment.role
                            }
                            {" · "}
                            {formatDateTime(
                              comment.created_at
                            )}
                          </span>
                        </div>

                        <p>
                          {
                            comment.content
                          }
                        </p>
                      </div>
                    </div>
                  )
                )
              )}
            </div>

            {ticket.status !==
              "CLOSED" && (
              <form
                className="comment-form"
                onSubmit={
                  handleComment
                }
              >
                <textarea
                  value={
                    commentText
                  }
                  onChange={(
                    event
                  ) =>
                    setCommentText(
                      event.target
                        .value
                    )
                  }
                  placeholder={t(
                    "tickets.detail.commentPlaceholder"
                  )}
                  rows={3}
                />

                <div className="comment-form-footer">
                  <button
                    type="submit"
                    className="button-primary"
                    disabled={
                      saving ||
                      !commentText.trim()
                    }
                  >
                    {saving
                      ? t(
                          "tickets.detail.sendingComment"
                        )
                      : t(
                          "tickets.detail.sendComment"
                        )}
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* HISTORY */}

          <section className="detail-card">
            <div className="detail-card-header">
              <h2>
                {t(
                  "tickets.detail.history"
                )}
              </h2>
            </div>

            <div className="ticket-history">
              {history.length ===
              0 ? (
                <div className="detail-empty">
                  {t(
                    "common.noData"
                  )}
                </div>
              ) : (
                history.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item.id
                      }
                      className="ticket-history-item"
                    >
                      <div className="history-track">
                        <span className="history-dot" />

                        {index <
                          history.length -
                            1 && (
                          <span className="history-line" />
                        )}
                      </div>

                      <div className="history-content">
                        <strong>
                          {item.old_status
                            ? `${statusText(
                                item.old_status,
                                t
                              )} → ${statusText(
                                item.new_status,
                                t
                              )}`
                            : statusText(
                                item.new_status,
                                t
                              )}
                        </strong>

                        {item.note && (
                          <p>
                            {
                              item.note
                            }
                          </p>
                        )}

                        <span>
                          {item.changed_by_name ||
                            "-"}
                          {" · "}
                          {formatDateTime(
                            item.changed_at
                          )}
                        </span>
                      </div>
                    </div>
                  )
                )
              )}
            </div>
          </section>

          {/* RATING */}

          {ticket.status ===
            "CLOSED" && (
            <section className="detail-card">
              <div className="detail-card-header">
                <h2>
                  {t(
                    "tickets.detail.rating"
                  )}
                </h2>
              </div>

              <div className="detail-card-body">
                {rating ? (
                  <div className="ticket-rating-result">
                    <div className="ticket-rating-stars">
                      {"★".repeat(
                        Number(
                          rating.rating
                        )
                      )}

                      {"☆".repeat(
                        5 -
                          Number(
                            rating.rating
                          )
                      )}
                    </div>

                    {rating.comment && (
                      <p>
                        {
                          rating.comment
                        }
                      </p>
                    )}

                    <span>
                      {rating.full_name ||
                        ""}
                    </span>
                  </div>
                ) : isEmployee ? (
                  <form
                    className="ticket-rating-form"
                    onSubmit={
                      handleRating
                    }
                  >
                    <div className="app-form-field">
                      <label>
                        {t(
                          "tickets.rating.selectRating"
                        )}
                      </label>

                      <select
                        value={
                          ratingScore
                        }
                        onChange={(
                          event
                        ) =>
                          setRatingScore(
                            event.target
                              .value
                          )
                        }
                      >
                        <option value="5">
                          ★★★★★
                        </option>

                        <option value="4">
                          ★★★★☆
                        </option>

                        <option value="3">
                          ★★★☆☆
                        </option>

                        <option value="2">
                          ★★☆☆☆
                        </option>

                        <option value="1">
                          ★☆☆☆☆
                        </option>
                      </select>
                    </div>

                    <div className="app-form-field">
                      <label>
                        {t(
                          "tickets.rating.comment"
                        )}
                      </label>

                      <textarea
                        rows={3}
                        value={
                          ratingComment
                        }
                        onChange={(
                          event
                        ) =>
                          setRatingComment(
                            event.target
                              .value
                          )
                        }
                        placeholder={t(
                          "tickets.rating.commentPlaceholder"
                        )}
                      />
                    </div>

                    <button
                      type="submit"
                      className="button-primary"
                      disabled={
                        saving
                      }
                    >
                      {saving
                        ? t(
                            "tickets.rating.submitting"
                          )
                        : t(
                            "tickets.rating.submit"
                          )}
                    </button>
                  </form>
                ) : (
                  <div className="detail-empty">
                    {t(
                      "tickets.detail.noRating"
                    )}
                  </div>
                )}
              </div>
            </section>
          )}
        </main>

        {/* ==========================
            SIDEBAR
        ========================== */}

        <aside className="ticket-detail-sidebar">
          {/* OVERVIEW */}

          <section className="detail-card">
            <div className="detail-card-header">
              <h2>
                {t(
                  "tickets.detail.overview"
                )}
              </h2>
            </div>

            <div className="ticket-overview-list">
              <InfoItem
                label={t(
                  "tickets.detail.category"
                )}
                value={
                  ticket.category
                }
              />

              <InfoItem
                label={t(
                  "tickets.detail.priority"
                )}
                value={t(
                  `tickets.priorities.${ticket.priority}`
                )}
              />

              <InfoItem
                label={t(
                  "tickets.detail.createdBy"
                )}
                value={
                  ticket.created_by_name
                }
              />

              <InfoItem
                label={t(
                  "tickets.detail.assignedTo"
                )}
                value={
                  ticket.assigned_to_name ||
                  "-"
                }
              />

              <InfoItem
                label={t(
                  "tickets.detail.updatedAt"
                )}
                value={formatDateTime(
                  ticket.updated_at
                )}
              />

              <InfoItem
                label={t(
                  "tickets.detail.linkedAsset"
                )}
                value={
                  ticket.asset_name
                    ? `${ticket.asset_code} · ${ticket.asset_name}`
                    : t(
                        "tickets.detail.noAsset"
                      )
                }
              />
            </div>
          </section>

          {/* ADMIN ASSIGN */}

          {isAdmin &&
            ![
              "RESOLVED",
              "CLOSED",
            ].includes(
              ticket.status
            ) && (
              <section className="detail-card">
                <div className="detail-card-header">
                  <h2>
                    {t(
                      "tickets.assign.title"
                    )}
                  </h2>
                </div>

                <div className="detail-action-panel">
                  <label>
                    {t(
                      "tickets.assign.selectSupport"
                    )}
                  </label>

                  <select
                    value={
                      selectedSupport
                    }
                    onChange={(
                      event
                    ) =>
                      setSelectedSupport(
                        event.target
                          .value
                      )
                    }
                  >
                    <option value="">
                      --
                    </option>

                    {supportUsers.map(
                      (
                        support
                      ) => (
                        <option
                          key={
                            support.id
                          }
                          value={
                            support.id
                          }
                        >
                          {support.full_name ||
                            support.fullName}
                          {" · "}
                          {
                            support.email
                          }
                        </option>
                      )
                    )}
                  </select>

                  <button
                    type="button"
                    className="button-primary"
                    disabled={
                      saving ||
                      !selectedSupport
                    }
                    onClick={
                      handleAssign
                    }
                  >
                    {saving
                      ? t(
                          "tickets.assign.assigning"
                        )
                      : t(
                          "tickets.assign.assignButton"
                        )}
                  </button>
                </div>
              </section>
            )}

          {/* SUPPORT ACTIONS */}

          {isSupport &&
            supportActions.length >
              0 && (
              <section className="detail-card">
                <div className="detail-card-header">
                  <h2>
                    {t(
                      "tickets.updateStatus.title"
                    )}
                  </h2>
                </div>

                <div className="detail-action-panel">
                  <label>
                    {t(
                      "tickets.updateStatus.note"
                    )}
                  </label>

                  <textarea
                    rows={4}
                    value={
                      statusNote
                    }
                    onChange={(
                      event
                    ) =>
                      setStatusNote(
                        event.target
                          .value
                      )
                    }
                    placeholder={t(
                      "tickets.updateStatus.notePlaceholder"
                    )}
                  />

                  <div className="detail-action-buttons">
                    {supportActions.map(
                      (
                        action
                      ) => (
                        <button
                          type="button"
                          key={
                            action.value
                          }
                          className="button-primary"
                          disabled={
                            saving
                          }
                          onClick={() =>
                            updateStatus(
                              action.value
                            )
                          }
                        >
                          {
                            action.label
                          }
                        </button>
                      )
                    )}
                  </div>
                </div>
              </section>
            )}

          {/* EMPLOYEE CLOSE */}

          {isEmployee &&
            ticket.status ===
              "RESOLVED" && (
              <section className="detail-card">
                <div className="detail-card-header">
                  <h2>
                    {t(
                      "tickets.statusActions.confirmTitle"
                    )}
                  </h2>
                </div>

                <div className="detail-action-panel">
                  <textarea
                    rows={3}
                    value={
                      statusNote
                    }
                    onChange={(
                      event
                    ) =>
                      setStatusNote(
                        event.target
                          .value
                      )
                    }
                    placeholder={t(
                      "tickets.updateStatus.notePlaceholder"
                    )}
                  />

                  <button
                    type="button"
                    className="button-primary"
                    disabled={
                      saving
                    }
                    onClick={() =>
                      updateStatus(
                        "CLOSED"
                      )
                    }
                  >
                    {t(
                      "tickets.statusActions.close"
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

/* =====================================
   INFO ITEM
===================================== */

const InfoItem = ({
  label,
  value,
}) => {
  return (
    <div className="ticket-overview-item">
      <span>
        {label}
      </span>

      <strong>
        {value || "-"}
      </strong>
    </div>
  );
};

/* =====================================
   STATUS
===================================== */

const TicketStatus = ({
  status,
  t,
}) => {
  if (!status) {
    return "-";
  }

  return (
    <span
      className={`ticket-status ticket-status-${String(
        status
      ).toLowerCase()}`}
    >
      {statusText(
        status,
        t
      )}
    </span>
  );
};

const statusText = (
  status,
  t
) => {
  if (!status) {
    return "-";
  }

  return t(
    `tickets.statuses.${status}`
  );
};

/* =====================================
   DATE
===================================== */

const formatDateTime = (
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

      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
};

/* =====================================
   INITIALS
===================================== */

const getInitials = (
  value
) => {
  if (!value) {
    return "?";
  }

  return value
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map(
      (part) =>
        part[0]
    )
    .join("")
    .toUpperCase();
};

export default TicketDetailPage;