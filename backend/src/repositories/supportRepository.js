const pool = require("../config/db");

const findAssignedTicketsBySupport = async ({
  userId,
  status,
  priority,
  search,
}) => {
  const conditions = [
    "t.assigned_to = $1",
  ];

  const values = [userId];

  let paramIndex = 2;

  if (status) {
    conditions.push(
      `t.status = $${paramIndex}`
    );

    values.push(status);

    paramIndex++;
  } else {
    conditions.push(`
      t.status IN (
        'ASSIGNED',
        'IN_PROGRESS',
        'WAITING_FOR_USER',
        'RESOLVED'
      )
    `);
  }

  if (priority) {
    conditions.push(
      `t.priority = $${paramIndex}`
    );

    values.push(priority);

    paramIndex++;
  }

  if (search) {
    conditions.push(`
      (
        t.ticket_code ILIKE $${paramIndex}
        OR t.title ILIKE $${paramIndex}
        OR t.description ILIKE $${paramIndex}
      )
    `);

    values.push(`%${search}%`);

    paramIndex++;
  }

  const query = `
    SELECT
      t.id,
      t.ticket_code,
      t.title,
      t.description,
      t.priority,
      t.status,
      t.created_at,
      t.updated_at,

      tc.name AS category,

      creator.full_name AS created_by_name,

      a.id AS asset_id,
      a.asset_code,
      a.asset_name

    FROM tickets t

    JOIN ticket_categories tc
      ON t.category_id = tc.id

    JOIN users creator
      ON t.created_by = creator.id

    LEFT JOIN assets a
      ON t.asset_id = a.id

    WHERE
      ${conditions.join(" AND ")}

    ORDER BY
      CASE t.priority
        WHEN 'URGENT' THEN 1
        WHEN 'HIGH' THEN 2
        WHEN 'MEDIUM' THEN 3
        WHEN 'LOW' THEN 4
        ELSE 5
      END,

      t.created_at ASC
  `;

  const result = await pool.query(
    query,
    values
  );

  return result.rows;
};

module.exports = {
  findAssignedTicketsBySupport,
};