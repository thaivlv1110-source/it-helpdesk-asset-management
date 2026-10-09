import {
  useEffect,
  useMemo,
  useState,
} from "react";

import axiosClient
  from "../api/axiosClient";

import {
  useAuth,
} from "../auth/AuthContext";

import {
  useLanguage,
} from "../i18n/LanguageContext";

const EMPTY_FORM = {
  fullName: "",
  email: "",
  password: "",
  role: "EMPLOYEE",
  departmentId: "",
};

const AdminUsersPage = () => {
  const { user: currentUser } =
    useAuth();

  const { t } =
    useLanguage();

  const [users, setUsers] =
    useState([]);

  const [
    departments,
    setDepartments,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("");

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  const [
    creating,
    setCreating,
  ] = useState(false);

  const [
    updatingUserId,
    setUpdatingUserId,
  ] = useState(null);

  const [form, setForm] =
    useState(EMPTY_FORM);

  /* =====================================
     LOAD USERS
  ===================================== */

  const loadUsers =
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await axiosClient.get(
            "/admin/users"
          );

        setUsers(
          response.data?.data ||
            []
        );
      } catch (error) {
        console.error(
          "LOAD USERS ERROR:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            t(
              "users.loadError"
            )
        );
      } finally {
        setLoading(false);
      }
    };

  /* =====================================
     LOAD DEPARTMENTS
  ===================================== */

  const loadDepartments =
    async () => {
      try {
        const response =
          await axiosClient.get(
            "/admin/departments"
          );

        setDepartments(
          response.data?.data ||
            []
        );
      } catch (error) {
        console.error(
          "LOAD DEPARTMENTS ERROR:",
          error
        );
      }
    };

  useEffect(() => {
    loadUsers();
    loadDepartments();
  }, []);

  /* =====================================
     FILTER
  ===================================== */

  const filteredUsers =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      return users.filter(
        (user) => {
          const fullName =
            user.full_name ||
            user.fullName ||
            "";

          const email =
            user.email ||
            "";

          const role =
            user.role ||
            "";

          const department =
            user.department ||
            "";

          const isActive =
            user.is_active ??
            user.isActive ??
            false;

          const matchesSearch =
            !keyword ||
            fullName
              .toLowerCase()
              .includes(
                keyword
              ) ||
            email
              .toLowerCase()
              .includes(
                keyword
              ) ||
            role
              .toLowerCase()
              .includes(
                keyword
              ) ||
            department
              .toLowerCase()
              .includes(
                keyword
              );

          const matchesRole =
            !roleFilter ||
            role ===
              roleFilter;

          const matchesStatus =
            statusFilter === ""
              ? true
              : statusFilter ===
                  "ACTIVE"
                ? isActive
                : !isActive;

          return (
            matchesSearch &&
            matchesRole &&
            matchesStatus
          );
        }
      );
    }, [
      users,
      search,
      roleFilter,
      statusFilter,
    ]);

  /* =====================================
     FORM
  ===================================== */

  const handleChange =
    (event) => {
      const {
        name,
        value,
      } = event.target;

      setForm(
        (previous) => ({
          ...previous,

          [name]:
            value,
        })
      );
    };

  const resetForm = () => {
    setForm(
      EMPTY_FORM
    );
  };

  const openModal = () => {
    setError("");
    setSuccess("");

    resetForm();

    setShowModal(true);
  };

  const closeModal = () => {
    if (creating) {
      return;
    }

    setShowModal(false);
  };

  /* =====================================
     CREATE USER
  ===================================== */

  const handleCreateUser =
    async (event) => {
      event.preventDefault();

      try {
        setCreating(true);
        setError("");
        setSuccess("");

        const payload = {
          fullName:
            form.fullName.trim(),

          email:
            form.email
              .trim()
              .toLowerCase(),

          password:
            form.password,

          role:
            form.role,

          departmentId:
            form.departmentId
              ? Number(
                  form.departmentId
                )
              : null,
        };

        await axiosClient.post(
          "/admin/users",
          payload
        );

        setShowModal(false);

        resetForm();

        setSuccess(
          t(
            "users.createSuccess"
          )
        );

        await loadUsers();
      } catch (error) {
        console.error(
          "CREATE USER ERROR:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            t(
              "users.createError"
            )
        );
      } finally {
        setCreating(false);
      }
    };

  /* =====================================
     STATUS
  ===================================== */

  const handleStatusChange =
    async (targetUser) => {
      const userId =
        targetUser.id;

      const currentStatus =
        targetUser.is_active ??
        targetUser.isActive;

      try {
        setUpdatingUserId(
          userId
        );

        setError("");
        setSuccess("");

        await axiosClient.patch(
          `/admin/users/${userId}/status`,
          {
            isActive:
              !currentStatus,
          }
        );

        setSuccess(
          t(
            "users.statusSuccess"
          )
        );

        await loadUsers();
      } catch (error) {
        console.error(
          "UPDATE USER STATUS ERROR:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
            t(
              "users.statusError"
            )
        );
      } finally {
        setUpdatingUserId(
          null
        );
      }
    };

  /* =====================================
     RESET FILTERS
  ===================================== */

  const resetFilters = () => {
    setSearch("");
    setRoleFilter("");
    setStatusFilter("");
  };

  return (
    <div className="users-page">
      {/* HEADER */}

      <div className="page-heading admin-page-heading">
        <div>
          <h1>
            {t(
              "users.title"
            )}
          </h1>

          <p>
            {t(
              "users.description"
            )}
          </p>
        </div>

        <button
          type="button"
          className="button-primary"
          onClick={
            openModal
          }
        >
          +{" "}
          {t(
            "users.addUser"
          )}
        </button>
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

      {/* TABLE */}

      <section className="content-panel">
        <div className="users-toolbar">
          <div className="users-search">
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
                "users.searchPlaceholder"
              )}
            />
          </div>

          <div className="users-filters">
            <select
              value={
                roleFilter
              }
              onChange={(
                event
              ) =>
                setRoleFilter(
                  event.target
                    .value
                )
              }
            >
              <option value="">
                {t(
                  "users.filters.allRoles"
                )}
              </option>

              <option value="EMPLOYEE">
                {t(
                  "roles.employee"
                )}
              </option>

              <option value="IT_SUPPORT">
                {t(
                  "roles.itSupport"
                )}
              </option>

              <option value="ADMIN">
                {t(
                  "roles.admin"
                )}
              </option>
            </select>

            <select
              value={
                statusFilter
              }
              onChange={(
                event
              ) =>
                setStatusFilter(
                  event.target
                    .value
                )
              }
            >
              <option value="">
                {t(
                  "users.filters.allStatuses"
                )}
              </option>

              <option value="ACTIVE">
                {t(
                  "users.active"
                )}
              </option>

              <option value="INACTIVE">
                {t(
                  "users.inactive"
                )}
              </option>
            </select>

            <button
              type="button"
              className="button-secondary"
              onClick={
                resetFilters
              }
            >
              {t(
                "common.reset"
              )}
            </button>
          </div>
        </div>

        <div className="users-count">
          {filteredUsers.length}{" "}
          {t(
            "users.usersCount"
          )}
        </div>

        {loading ? (
          <div className="empty-state">
            <p>
              {t(
                "common.loading"
              )}
            </p>
          </div>
        ) : filteredUsers.length ===
          0 ? (
          <div className="empty-state">
            <strong>
              {t(
                "users.noUsers"
              )}
            </strong>

            <p>
              {t(
                "users.noUsersDescription"
              )}
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>
                    {t(
                      "users.fullName"
                    )}
                  </th>

                  <th>
                    {t(
                      "users.email"
                    )}
                  </th>

                  <th>
                    {t(
                      "users.role"
                    )}
                  </th>

                  <th>
                    {t(
                      "users.department"
                    )}
                  </th>

                  <th>
                    {t(
                      "users.status"
                    )}
                  </th>

                  <th>
                    {t(
                      "users.action"
                    )}
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map(
                  (
                    targetUser
                  ) => {
                    const fullName =
                      targetUser.full_name ||
                      targetUser.fullName ||
                      "-";

                    const isActive =
                      targetUser.is_active ??
                      targetUser.isActive ??
                      false;

                    const isSelf =
                      Number(
                        currentUser?.id ||
                          currentUser?.userId
                      ) ===
                      Number(
                        targetUser.id
                      );

                    const isUpdating =
                      updatingUserId ===
                      targetUser.id;

                    return (
                      <tr
                        key={
                          targetUser.id
                        }
                      >
                        <td>
                          <div className="table-primary">
                            {
                              fullName
                            }

                            {isSelf && (
                              <span className="users-self-label">
                                {t(
                                  "users.you"
                                )}
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          {
                            targetUser.email
                          }
                        </td>

                        <td>
                          <RoleBadge
                            role={
                              targetUser.role
                            }
                            t={t}
                          />
                        </td>

                        <td>
                          {targetUser.department ||
                            "-"}
                        </td>

                        <td>
                          <span
                            className={
                              isActive
                                ? "status-pill status-active"
                                : "status-pill status-inactive"
                            }
                          >
                            {isActive
                              ? t(
                                  "users.active"
                                )
                              : t(
                                  "users.inactive"
                                )}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="table-action-button"
                            disabled={
                              isUpdating ||
                              (isSelf &&
                                isActive)
                            }
                            title={
                              isSelf &&
                              isActive
                                ? t(
                                    "users.cannotDeactivateSelf"
                                  )
                                : ""
                            }
                            onClick={() =>
                              handleStatusChange(
                                targetUser
                              )
                            }
                          >
                            {isUpdating
                              ? t(
                                  "users.updating"
                                )
                              : isActive
                                ? t(
                                    "users.deactivate"
                                  )
                                : t(
                                    "users.activate"
                                  )}
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* CREATE MODAL */}

      {showModal && (
        <div
          className="modal-backdrop"
          onMouseDown={
            closeModal
          }
        >
          <div
            className="modal-card"
            onMouseDown={(
              event
            ) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>
                  {t(
                    "users.createTitle"
                  )}
                </h2>

                <p>
                  {t(
                    "users.createDescription"
                  )}
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={
                  closeModal
                }
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                handleCreateUser
              }
            >
              <div className="modal-body">
                <div className="form-field">
                  <label>
                    {t(
                      "users.fullName"
                    )}
                  </label>

                  <input
                    name="fullName"
                    value={
                      form.fullName
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Nguyen Van A"
                    required
                    minLength={2}
                  />
                </div>

                <div className="form-field">
                  <label>
                    {t(
                      "users.email"
                    )}
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      form.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="employee@company.com"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>
                    {t(
                      "users.initialPassword"
                    )}
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={
                      form.password
                    }
                    onChange={
                      handleChange
                    }
                    minLength={6}
                    required
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-field">
                    <label>
                      {t(
                        "users.role"
                      )}
                    </label>

                    <select
                      name="role"
                      value={
                        form.role
                      }
                      onChange={
                        handleChange
                      }
                    >
                      <option value="EMPLOYEE">
                        {t(
                          "roles.employee"
                        )}
                      </option>

                      <option value="IT_SUPPORT">
                        {t(
                          "roles.itSupport"
                        )}
                      </option>

                      <option value="ADMIN">
                        {t(
                          "roles.admin"
                        )}
                      </option>
                    </select>
                  </div>

                  <div className="form-field">
                    <label>
                      {t(
                        "users.department"
                      )}
                    </label>

                    <select
                      name="departmentId"
                      value={
                        form.departmentId
                      }
                      onChange={
                        handleChange
                      }
                    >
                      <option value="">
                        {t(
                          "users.noDepartment"
                        )}
                      </option>

                      {departments.map(
                        (
                          department
                        ) => (
                          <option
                            key={
                              department.id
                            }
                            value={
                              department.id
                            }
                          >
                            {
                              department.name
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="button-secondary"
                  onClick={
                    closeModal
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
                        "users.creating"
                      )
                    : t(
                        "users.createUser"
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

const RoleBadge = ({
  role,
  t,
}) => {
  const labels = {
    EMPLOYEE:
      t(
        "roles.employee"
      ),

    IT_SUPPORT:
      t(
        "roles.itSupport"
      ),

    ADMIN:
      t(
        "roles.admin"
      ),
  };

  return (
    <span className="role-pill">
      {labels[role] ||
        role ||
        "-"}
    </span>
  );
};

export default AdminUsersPage;