const db = require("../config/db");

/* =========================================
   USERS
========================================= */

const findAllUsers = async () => {
  const result = await db.query(`
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.is_active,
      u.department_id,
      r.name AS role,
      d.name AS department
    FROM users u
    JOIN roles r
      ON u.role_id = r.id
    LEFT JOIN departments d
      ON u.department_id = d.id
    ORDER BY u.id ASC
  `);

  return result.rows;
};

const findUserById = async (id) => {
  const result = await db.query(
    `
      SELECT
        u.id,
        u.full_name,
        u.email,
        u.is_active,
        u.department_id,
        r.name AS role,
        d.name AS department
      FROM users u
      JOIN roles r
        ON u.role_id = r.id
      LEFT JOIN departments d
        ON u.department_id = d.id
      WHERE u.id = $1
      LIMIT 1
    `,
    [id]
  );

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await db.query(
    `
      SELECT
        id,
        email
      FROM users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1
    `,
    [email]
  );

  return result.rows[0];
};

/* =========================================
   ROLES
========================================= */

const findRoleByName = async (
  roleName
) => {
  const result = await db.query(
    `
      SELECT
        id,
        name
      FROM roles
      WHERE name = $1
      LIMIT 1
    `,
    [roleName]
  );

  return result.rows[0];
};

const findAllRoles = async () => {
  const result = await db.query(`
    SELECT
      id,
      name
    FROM roles
    ORDER BY id ASC
  `);

  return result.rows;
};

/* =========================================
   DEPARTMENTS
========================================= */

const findDepartmentById = async (
  departmentId
) => {
  const result = await db.query(
    `
      SELECT
        id,
        name
      FROM departments
      WHERE id = $1
      LIMIT 1
    `,
    [departmentId]
  );

  return result.rows[0];
};

const findAllDepartments =
  async () => {
    const result =
      await db.query(`
        SELECT
          id,
          name
        FROM departments
        ORDER BY name ASC
      `);

    return result.rows;
  };

/* =========================================
   CREATE USER
========================================= */

const createUser = async ({
  fullName,
  email,
  passwordHash,
  roleId,
  departmentId,
}) => {
  const result = await db.query(
    `
      INSERT INTO users (
        full_name,
        email,
        password_hash,
        role_id,
        department_id,
        is_active
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        TRUE
      )

      RETURNING
        id,
        full_name,
        email,
        department_id,
        is_active
    `,
    [
      fullName,
      email,
      passwordHash,
      roleId,
      departmentId,
    ]
  );

  return result.rows[0];
};

/* =========================================
   UPDATE STATUS
========================================= */

const updateUserStatus = async (
  id,
  isActive
) => {
  const result = await db.query(
    `
      UPDATE users
      SET is_active = $1
      WHERE id = $2

      RETURNING
        id,
        full_name,
        email,
        is_active
    `,
    [isActive, id]
  );

  return result.rows[0];
};

module.exports = {
  findAllUsers,
  findUserById,
  findUserByEmail,

  findRoleByName,
  findAllRoles,

  findDepartmentById,
  findAllDepartments,

  createUser,
  updateUserStatus,
};