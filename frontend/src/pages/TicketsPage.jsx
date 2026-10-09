import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import axiosClient from "../api/axiosClient";

import {
  useAuth,
} from "../auth/AuthContext";

import {
  useLanguage,
} from "../i18n/LanguageContext";

const EMPTY_FORM = {
  title: "",
  description: "",
  categoryId: "",
  priority: "MEDIUM",
};

const TicketsPage = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const { t } = useLanguage();

  const [tickets, setTickets] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [priority, setPriority] =
    useState("");

  const [
    createModalOpen,
    setCreateModalOpen,
  ] = useState(false);

  const [
    creating,
    setCreating,
  ] = useState(false);

  const [form, setForm] =
    useState(EMPTY_FORM);

  const isEmployee =
    user?.role === "EMPLOYEE";

  const isSupport =
    user?.role === "IT_SUPPORT";

  const isAdmin =
    user?.role === "ADMIN";

  /* =====================================
     LOAD TICKETS
  ===================================== */

  const loadTickets = async (
    override = {}
  ) => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      const currentSearch =
        override.search ??
        search;

      const currentStatus =
        override.status ??
        status;

      const currentPriority =
        override.priority ??
        priority;

      if (
        String(
          currentSearch
        ).trim()
      ) {
        params.search =
          String(
            currentSearch
          ).trim();
      }

      if (currentStatus) {
        params.status =
          currentStatus;
      }

      if (currentPriority) {
        params.priority =
          currentPriority;
      }

      let response;

      if (isEmployee) {
        response =
          await axiosClient.get(
            "/tickets/my",
            {
              params,
            }
          );
      } else if (isSupport) {
        response =
          await axiosClient.get(
            "/support/tickets",
            {
              params,
            }
          );
      } else if (isAdmin) {
        response =
          await axiosClient.get(
            "/tickets",
            {
              params,
            }
          );
      } else {
        setTickets([]);

        return;
      }

      setTickets(
        response?.data?.data ||
          []
      );
    } catch (error) {
      console.error(
        "LOAD TICKETS ERROR:",
        error
      );

      setError(
        error.response?.data
          ?.message ||
          t(
            "tickets.loadError"
          )
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================
     LOAD CATEGORIES
  ===================================== */

  const loadCategories =
    async () => {
      if (!isEmployee) {
        return;
      }

      try {
        const response =
          await axiosClient.get(
            "/tickets/categories"
          );

        setCategories(
          response?.data?.data ||
            []
        );
      } catch (error) {
        console.error(
          "LOAD CATEGORIES ERROR:",
          error
        );
      }
    };

  useEffect(() => {
    loadTickets();
  }, [
    user?.role,
    status,
    priority,
  ]);

  useEffect(() => {
    loadCategories();
  }, [isEmployee]);

  /* =====================================
     SEARCH
  ===================================== */

  const handleSearchSubmit = (
    event
  ) => {
    event.preventDefault();

    loadTickets();
  };

  const handleReset = () => {
    setSearch("");
    setStatus("");
    setPriority("");

    loadTickets({
      search: "",
      status: "",
      priority: "",
    });
  };

  /* =====================================
     CREATE MODAL
  ===================================== */

  const openCreateModal =
    () => {
      setError("");
      setSuccess("");

      setForm(
        EMPTY_FORM
      );

      setCreateModalOpen(
        true
      );
    };

  const closeCreateModal =
    () => {
      if (creating) {
        return;
      }

      setCreateModalOpen(
        false
      );
    };

  const handleFormChange =
    (event) => {
      const {
        name,
        value,
      } = event.target;

      setForm(
        (current) => ({
          ...current,

          [name]:
            value,
        })
      );
    };

  /* =====================================
     CREATE TICKET
  ===================================== */

  const handleCreateTicket =
    async (event) => {
      event.preventDefault();

      try {
        setCreating(true);
        setError("");
        setSuccess("");

        await axiosClient.post(
          "/tickets",
          {
            title:
              form.title.trim(),

            description:
              form.description.trim(),

            categoryId:
              Number(
                form.categoryId
              ),

            priority:
              form.priority,
          }
        );

        setCreateModalOpen(
          false
        );

        setForm(
          EMPTY_FORM
        );

        setSearch("");
        setStatus("");
        setPriority("");

        setSuccess(
          t(
            "tickets.create.success"
          )
        );

        await loadTickets({
          search: "",
          status: "",
          priority: "",
        });
      } catch (error) {
        console.error(
          "CREATE TICKET ERROR:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            t(
              "tickets.create.error"
            )
        );
      } finally {
        setCreating(false);
      }
    };

  /* =====================================
     PAGE TEXT
  ===================================== */

  const getPageTitle = () => {
    if (isEmployee) {
      return t(
        "tickets.employeeTitle"
      );
    }

    if (isSupport) {
      return t(
        "tickets.supportTitle"
      );
    }

    return t(
      "tickets.adminTitle"
    );
  };

  const getDescription = () => {
    if (isEmployee) {
      return t(
        "tickets.employeeDescription"
      );
    }

    if (isSupport) {
      return t(
        "tickets.supportDescription"
      );
    }

    return t(
      "tickets.adminDescription"
    );
  };

  return (
    <div className="tickets-page">
      {/* HEADER */}

      <div className="tickets-page-header">
        <div>
          <h1>
            {getPageTitle()}
          </h1>

          <p>
            {getDescription()}
          </p>
        </div>

        {isEmployee && (
          <button
            type="button"
            className="button-primary ticket-create-button"
            onClick={
              openCreateModal
            }
          >
            <span>
              +
            </span>

            {t(
              "tickets.createTicket"
            )}
          </button>
        )}
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

      {/* CARD */}

      <section className="tickets-card">
        {/* TOOLBAR */}

        <div className="tickets-toolbar">
          <form
            className="tickets-search-form"
            onSubmit={
              handleSearchSubmit
            }
          >
            <div className="tickets-search-input">
              <span className="tickets-search-icon">
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                placeholder={t(
                  "tickets.searchPlaceholder"
                )}
              />
            </div>

            <button
              type="submit"
              className="button-secondary tickets-search-button"
            >
              {t(
                "common.search"
              )}
            </button>
          </form>

          <div className="tickets-filter-group">
            <select
              value={status}
              onChange={(
                event
              ) =>
                setStatus(
                  event.target
                    .value
                )
              }
            >
              <option value="">
                {t(
                  "tickets.filters.allStatuses"
                )}
              </option>

              <option value="OPEN">
                {t(
                  "tickets.statuses.OPEN"
                )}
              </option>

              <option value="ASSIGNED">
                {t(
                  "tickets.statuses.ASSIGNED"
                )}
              </option>

              <option value="IN_PROGRESS">
                {t(
                  "tickets.statuses.IN_PROGRESS"
                )}
              </option>

              <option value="WAITING_FOR_USER">
                {t(
                  "tickets.statuses.WAITING_FOR_USER"
                )}
              </option>

              <option value="RESOLVED">
                {t(
                  "tickets.statuses.RESOLVED"
                )}
              </option>

              <option value="CLOSED">
                {t(
                  "tickets.statuses.CLOSED"
                )}
              </option>
            </select>

            <select
              value={priority}
              onChange={(
                event
              ) =>
                setPriority(
                  event.target
                    .value
                )
              }
            >
              <option value="">
                {t(
                  "tickets.filters.allPriorities"
                )}
              </option>

              <option value="LOW">
                {t(
                  "tickets.priorities.LOW"
                )}
              </option>

              <option value="MEDIUM">
                {t(
                  "tickets.priorities.MEDIUM"
                )}
              </option>

              <option value="HIGH">
                {t(
                  "tickets.priorities.HIGH"
                )}
              </option>

              <option value="URGENT">
                {t(
                  "tickets.priorities.URGENT"
                )}
              </option>
            </select>

            <button
              type="button"
              className="button-secondary tickets-reset-button"
              onClick={
                handleReset
              }
            >
              {t(
                "common.reset"
              )}
            </button>
          </div>
        </div>

        {/* COUNT */}

        <div className="tickets-table-meta">
          <span>
            {tickets.length}{" "}
            {t(
              "tickets.total"
            )}
          </span>
        </div>

        {/* LOADING */}

        {loading ? (
          <div className="tickets-empty-state">
            <div className="tickets-loader" />

            <p>
              {t(
                "common.loading"
              )}
            </p>
          </div>
        ) : tickets.length ===
          0 ? (
          <div className="tickets-empty-state">
            <strong>
              {t(
                "tickets.noTickets"
              )}
            </strong>

            <p>
              {t(
                "tickets.noTicketsDescription"
              )}
            </p>
          </div>
        ) : (
          /* TABLE */

          <div className="tickets-table-wrapper">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>
                    {t(
                      "tickets.ticketCode"
                    )}
                  </th>

                  <th>
                    {t(
                      "tickets.titleColumn"
                    )}
                  </th>

                  <th>
                    {t(
                      "tickets.category"
                    )}
                  </th>

                  <th>
                    {t(
                      "tickets.priority"
                    )}
                  </th>

                  <th>
                    {t(
                      "tickets.status"
                    )}
                  </th>

                  {isAdmin && (
                    <th>
                      {t(
                        "tickets.assignedTo"
                      )}
                    </th>
                  )}

                  <th>
                    {t(
                      "tickets.createdAt"
                    )}
                  </th>

                  <th />
                </tr>
              </thead>

              <tbody>
                {tickets.map(
                  (ticket) => (
                    <tr
                      key={
                        ticket.id
                      }
                      onClick={() =>
                        navigate(
                          `/tickets/${ticket.id}`
                        )
                      }
                    >
                      <td>
                        <span className="ticket-code">
                          {ticket.ticket_code ||
                            ticket.ticketCode ||
                            "-"}
                        </span>
                      </td>

                      <td>
                        <strong className="ticket-title-cell">
                          {ticket.title ||
                            "-"}
                        </strong>
                      </td>

                      <td>
                        {ticket.category_name ||
                          ticket.category ||
                          "-"}
                      </td>

                      <td>
                        <PriorityBadge
                          priority={
                            ticket.priority
                          }
                          t={t}
                        />
                      </td>

                      <td>
                        <TicketStatus
                          status={
                            ticket.status
                          }
                          t={t}
                        />
                      </td>

                      {isAdmin && (
                        <td>
                          {ticket.assigned_to_name ||
                            "-"}
                        </td>
                      )}

                      <td>
                        {formatDate(
                          ticket.created_at ||
                            ticket.createdAt
                        )}
                      </td>

                      <td className="ticket-row-arrow">
                        ›
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* CREATE MODAL */}

      {createModalOpen && (
        <div
          className="app-modal-overlay"
          onMouseDown={
            closeCreateModal
          }
        >
          <div
            className="app-modal"
            onMouseDown={(
              event
            ) =>
              event.stopPropagation()
            }
          >
            <form
              onSubmit={
                handleCreateTicket
              }
            >
              <div className="app-modal-header">
                <div>
                  <h2>
                    {t(
                      "tickets.create.title"
                    )}
                  </h2>

                  <p>
                    {t(
                      "tickets.create.description"
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  className="app-modal-close"
                  onClick={
                    closeCreateModal
                  }
                >
                  ×
                </button>
              </div>

              <div className="app-modal-body">
                <div className="app-form-field">
                  <label>
                    {t(
                      "tickets.create.ticketTitle"
                    )}
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={
                      form.title
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder={t(
                      "tickets.create.titlePlaceholder"
                    )}
                    required
                    minLength={3}
                  />
                </div>

                <div className="app-form-row">
                  <div className="app-form-field">
                    <label>
                      {t(
                        "tickets.create.category"
                      )}
                    </label>

                    <select
                      name="categoryId"
                      value={
                        form.categoryId
                      }
                      onChange={
                        handleFormChange
                      }
                      required
                    >
                      <option value="">
                        --
                      </option>

                      {categories.map(
                        (
                          category
                        ) => (
                          <option
                            key={
                              category.id
                            }
                            value={
                              category.id
                            }
                          >
                            {
                              category.name
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="app-form-field">
                    <label>
                      {t(
                        "tickets.create.priority"
                      )}
                    </label>

                    <select
                      name="priority"
                      value={
                        form.priority
                      }
                      onChange={
                        handleFormChange
                      }
                    >
                      <option value="LOW">
                        {t(
                          "tickets.priorities.LOW"
                        )}
                      </option>

                      <option value="MEDIUM">
                        {t(
                          "tickets.priorities.MEDIUM"
                        )}
                      </option>

                      <option value="HIGH">
                        {t(
                          "tickets.priorities.HIGH"
                        )}
                      </option>

                      <option value="URGENT">
                        {t(
                          "tickets.priorities.URGENT"
                        )}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="app-form-field">
                  <label>
                    {t(
                      "tickets.create.descriptionLabel"
                    )}
                  </label>

                  <textarea
                    name="description"
                    value={
                      form.description
                    }
                    onChange={
                      handleFormChange
                    }
                    placeholder={t(
                      "tickets.create.descriptionPlaceholder"
                    )}
                    rows={6}
                    required
                    minLength={5}
                  />
                </div>
              </div>

              <div className="app-modal-footer">
                <button
                  type="button"
                  className="button-secondary"
                  onClick={
                    closeCreateModal
                  }
                  disabled={
                    creating
                  }
                >
                  {t(
                    "common.cancel"
                  )}
                </button>

                <button
                  type="submit"
                  className="button-primary"
                  disabled={
                    creating
                  }
                >
                  {creating
                    ? t(
                        "tickets.create.creating"
                      )
                    : t(
                        "tickets.create.createButton"
                      )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
      className={`ticket-status ticket-status-${status.toLowerCase()}`}
    >
      {t(
        `tickets.statuses.${status}`
      )}
    </span>
  );
};

/* =====================================
   PRIORITY
===================================== */

const PriorityBadge = ({
  priority,
  t,
}) => {
  if (!priority) {
    return "-";
  }

  return (
    <span
      className={`ticket-priority ticket-priority-${priority.toLowerCase()}`}
    >
      {t(
        `tickets.priorities.${priority}`
      )}
    </span>
  );
};

/* =====================================
   DATE
===================================== */

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

export default TicketsPage;