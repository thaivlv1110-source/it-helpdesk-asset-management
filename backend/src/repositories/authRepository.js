const pool = require("../config/db");

const findUserByEmail = async (email) => {
  const query = `
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.password_hash,
      u.is_active,
      r.name AS role
    FROM users u
    JOIN roles r
      ON u.role_id = r.id
    WHERE u.email = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0];
};

const findUserById = async (id) => {
  const query = `
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.is_active,
      r.name AS role,
      d.name AS department
    FROM users u
    JOIN roles r
      ON u.role_id = r.id
    LEFT JOIN departments d
      ON u.department_id = d.id
    WHERE u.id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  findUserById,
};