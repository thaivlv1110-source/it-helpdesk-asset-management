const pool = require("../config/db");

/* =========================================
   CATEGORY
========================================= */

const findCategoryById = async (categoryId) => {
  const query = `
    SELECT
      id,
      name
    FROM ticket_categories
    WHERE id = $1
  `;

  const result = await pool.query(
    query,
    [categoryId]
  );

  return result.rows[0];
};

const findAllCategories = async () => {
  const query = `
    SELECT
      id,
      name
    FROM ticket_categories
    ORDER BY name ASC
  `;

  const result =
    await pool.query(query);

  return result.rows;
};

/* =========================================
   CREATE TICKET
========================================= */

const createTicket = async ({
  ticketCode,
  title,
  description,
  categoryId,
  priority,
  createdBy,
}) => {
  const client =
    await pool.connect();

  try {
    await client.query(
      "BEGIN"
    );

    const ticketQuery = `
      INSERT INTO tickets (
        ticket_code,
        title,
        description,
        category_id,
        priority,
        created_by
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )
      RETURNING *
    `;

    const ticketResult =
      await client.query(
        ticketQuery,
        [
          ticketCode,
          title,
          description,
          categoryId,
          priority,
          createdBy,
        ]
      );

    const ticket =
      ticketResult.rows[0];

    await client.query(
      `
        INSERT INTO ticket_status_history (
          ticket_id,
          changed_by,
          old_status,
          new_status,
          note
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5
        )
      `,
      [
        ticket.id,
        createdBy,
        null,
        "OPEN",
        "Ticket created",
      ]
    );

    await client.query(
      "COMMIT"
    );

    return ticket;
  } catch (error) {
    await client.query(
      "ROLLBACK"
    );

    throw error;
  } finally {
    client.release();
  }
};

/* =========================================
   EMPLOYEE - MY TICKETS
========================================= */

const findTicketsByUserId = async ({
  userId,
  status,
  priority,
  categoryId,
  search,
}) => {
  const conditions = [
    "t.created_by = $1",
  ];

  const values = [
    userId,
  ];

  let paramIndex = 2;

  if (status) {
    conditions.push(
      `t.status = $${paramIndex}`
    );

    values.push(status);

    paramIndex++;
  }

  if (priority) {
    conditions.push(
      `t.priority = $${paramIndex}`
    );

    values.push(priority);

    paramIndex++;
  }

  if (categoryId) {
    conditions.push(
      `t.category_id = $${paramIndex}`
    );

    values.push(categoryId);

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

    values.push(
      `%${search}%`
    );

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
      t.asset_id,
      t.created_at,
      t.updated_at,

      tc.id AS category_id,
      tc.name AS category,

      a.asset_code,
      a.asset_name

    FROM tickets t

    JOIN ticket_categories tc
      ON t.category_id = tc.id

    LEFT JOIN assets a
      ON t.asset_id = a.id

    WHERE
      ${conditions.join(" AND ")}

    ORDER BY
      t.created_at DESC
  `;

  const result =
    await pool.query(
      query,
      values
    );

  return result.rows;
};

/* =========================================
   ADMIN - ALL TICKETS
========================================= */

const findAllTickets = async ({
  status,
  priority,
  categoryId,
  search,
}) => {
  const conditions = [];

  const values = [];

  let paramIndex = 1;

  if (status) {
    conditions.push(
      `t.status = $${paramIndex}`
    );

    values.push(status);

    paramIndex++;
  }

  if (priority) {
    conditions.push(
      `t.priority = $${paramIndex}`
    );

    values.push(priority);

    paramIndex++;
  }

  if (categoryId) {
    conditions.push(
      `t.category_id = $${paramIndex}`
    );

    values.push(categoryId);

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

    values.push(
      `%${search}%`
    );

    paramIndex++;
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(
          " AND "
        )}`
      : "";

  const query = `
    SELECT
      t.id,
      t.ticket_code,
      t.title,
      t.description,
      t.priority,
      t.status,

      t.category_id,
      t.asset_id,

      t.created_by,
      t.assigned_to,

      t.resolved_at,
      t.closed_at,

      t.created_at,
      t.updated_at,

      tc.name AS category,

      creator.full_name
        AS created_by_name,

      creator.email
        AS created_by_email,

      assignee.full_name
        AS assigned_to_name,

      assignee.email
        AS assigned_to_email,

      a.asset_code,

      a.asset_name,

      a.status
        AS asset_status

    FROM tickets t

    JOIN ticket_categories tc
      ON t.category_id = tc.id

    JOIN users creator
      ON t.created_by = creator.id

    LEFT JOIN users assignee
      ON t.assigned_to = assignee.id

    LEFT JOIN assets a
      ON t.asset_id = a.id

    ${whereClause}

    ORDER BY
      CASE t.priority
        WHEN 'URGENT' THEN 1
        WHEN 'HIGH' THEN 2
        WHEN 'MEDIUM' THEN 3
        WHEN 'LOW' THEN 4
        ELSE 5
      END,
      t.created_at DESC
  `;

  const result =
    await pool.query(
      query,
      values
    );

  return result.rows;
};

/* =========================================
   TICKET DETAIL
========================================= */

const findTicketById = async (
  ticketId
) => {
  const query = `
    SELECT
      t.id,
      t.ticket_code,
      t.title,
      t.description,
      t.priority,
      t.status,

      t.created_by,
      t.assigned_to,
      t.asset_id,

      t.resolved_at,
      t.closed_at,

      t.created_at,
      t.updated_at,

      tc.id AS category_id,
      tc.name AS category,

      creator.full_name
        AS created_by_name,

      assignee.full_name
        AS assigned_to_name,

      a.asset_code,
      a.asset_name,

      a.status
        AS asset_status

    FROM tickets t

    JOIN ticket_categories tc
      ON t.category_id = tc.id

    JOIN users creator
      ON t.created_by = creator.id

    LEFT JOIN users assignee
      ON t.assigned_to = assignee.id

    LEFT JOIN assets a
      ON t.asset_id = a.id

    WHERE t.id = $1

    LIMIT 1
  `;

  const result =
    await pool.query(
      query,
      [ticketId]
    );

  return result.rows[0];
};

/* =========================================
   USER WITH ROLE
========================================= */

const findUserByIdWithRole = async (
  userId
) => {
  const query = `
    SELECT
      u.id,
      u.full_name,
      u.email,
      u.is_active,

      r.name AS role

    FROM users u

    JOIN roles r
      ON u.role_id = r.id

    WHERE u.id = $1

    LIMIT 1
  `;

  const result =
    await pool.query(
      query,
      [userId]
    );

  return result.rows[0];
};

/* =========================================
   ASSIGN TICKET
========================================= */

const assignTicket = async ({
  ticketId,
  assigneeId,
  changedBy,
}) => {
  const client =
    await pool.connect();

  try {
    await client.query(
      "BEGIN"
    );

    const currentTicketResult =
      await client.query(
        `
          SELECT
            id,
            status,
            assigned_to

          FROM tickets

          WHERE id = $1

          FOR UPDATE
        `,
        [ticketId]
      );

    const currentTicket =
      currentTicketResult
        .rows[0];

    if (!currentTicket) {
      throw new Error(
        "TICKET_NOT_FOUND"
      );
    }

    const oldStatus =
      currentTicket.status;

    const updateResult =
      await client.query(
        `
          UPDATE tickets

          SET
            assigned_to = $1,

            status =
              'ASSIGNED',

            updated_at =
              CURRENT_TIMESTAMP

          WHERE id = $2

          RETURNING *
        `,
        [
          assigneeId,
          ticketId,
        ]
      );

    await client.query(
      `
        INSERT INTO ticket_status_history (
          ticket_id,
          changed_by,
          old_status,
          new_status,
          note
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5
        )
      `,
      [
        ticketId,
        changedBy,
        oldStatus,
        "ASSIGNED",
        `Ticket assigned to user ${assigneeId}`,
      ]
    );

    await client.query(
      "COMMIT"
    );

    return updateResult
      .rows[0];
  } catch (error) {
    await client.query(
      "ROLLBACK"
    );

    throw error;
  } finally {
    client.release();
  }
};

/* =========================================
   UPDATE STATUS
========================================= */

const updateTicketStatus = async ({
  ticketId,
  newStatus,
  changedBy,
  note,
}) => {
  const client =
    await pool.connect();

  try {
    await client.query(
      "BEGIN"
    );

    const currentResult =
      await client.query(
        `
          SELECT
            id,
            status,
            assigned_to

          FROM tickets

          WHERE id = $1

          FOR UPDATE
        `,
        [ticketId]
      );

    const currentTicket =
      currentResult.rows[0];

    if (!currentTicket) {
      throw new Error(
        "TICKET_NOT_FOUND"
      );
    }

    const oldStatus =
      currentTicket.status;

    const updateResult =
      await client.query(
        `
          UPDATE tickets

          SET
            status =
              $1::VARCHAR,

            updated_at =
              CURRENT_TIMESTAMP,

            resolved_at =
              CASE
                WHEN $1::VARCHAR =
                  'RESOLVED'
                THEN
                  CURRENT_TIMESTAMP

                ELSE
                  resolved_at
              END,

            closed_at =
              CASE
                WHEN $1::VARCHAR =
                  'CLOSED'
                THEN
                  CURRENT_TIMESTAMP

                ELSE
                  closed_at
              END

          WHERE id = $2

          RETURNING *
        `,
        [
          newStatus,
          ticketId,
        ]
      );

    await client.query(
      `
        INSERT INTO ticket_status_history (
          ticket_id,
          changed_by,
          old_status,
          new_status,
          note
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5
        )
      `,
      [
        ticketId,
        changedBy,
        oldStatus,
        newStatus,
        note || null,
      ]
    );

    await client.query(
      "COMMIT"
    );

    return updateResult
      .rows[0];
  } catch (error) {
    await client.query(
      "ROLLBACK"
    );

    throw error;
  } finally {
    client.release();
  }
};

/* =========================================
   COMMENTS
========================================= */

const createComment = async ({
  ticketId,
  userId,
  content,
}) => {
  const query = `
    INSERT INTO ticket_comments (
      ticket_id,
      user_id,
      content
    )
    VALUES (
      $1,
      $2,
      $3
    )
    RETURNING *
  `;

  const result =
    await pool.query(
      query,
      [
        ticketId,
        userId,
        content,
      ]
    );

  return result.rows[0];
};

const findCommentsByTicketId = async (
  ticketId
) => {
  const query = `
    SELECT
      tc.id,
      tc.content,
      tc.created_at,

      u.id AS user_id,
      u.full_name,

      r.name AS role

    FROM ticket_comments tc

    JOIN users u
      ON tc.user_id = u.id

    JOIN roles r
      ON u.role_id = r.id

    WHERE tc.ticket_id = $1

    ORDER BY
      tc.created_at ASC
  `;

  const result =
    await pool.query(
      query,
      [ticketId]
    );

  return result.rows;
};

/* =========================================
   RATING
========================================= */

const findRatingByTicketId = async (
  ticketId
) => {
  const query = `
    SELECT
      tr.id,
      tr.ticket_id,
      tr.user_id,
      tr.rating,
      tr.comment,
      tr.created_at,

      u.full_name

    FROM ticket_ratings tr

    JOIN users u
      ON tr.user_id = u.id

    WHERE tr.ticket_id = $1

    LIMIT 1
  `;

  const result =
    await pool.query(
      query,
      [ticketId]
    );

  return result.rows[0];
};

const createRating = async ({
  ticketId,
  userId,
  rating,
  comment,
}) => {
  const query = `
    INSERT INTO ticket_ratings (
      ticket_id,
      user_id,
      rating,
      comment
    )
    VALUES (
      $1,
      $2,
      $3,
      $4
    )
    RETURNING *
  `;

  const result =
    await pool.query(
      query,
      [
        ticketId,
        userId,
        rating,
        comment || null,
      ]
    );

  return result.rows[0];
};

/* =========================================
   LINK ASSET
========================================= */

const linkAssetToTicket = async ({
  ticketId,
  assetId,
}) => {
  const query = `
    UPDATE tickets

    SET
      asset_id = $1,

      updated_at =
        CURRENT_TIMESTAMP

    WHERE id = $2

    RETURNING *
  `;

  const result =
    await pool.query(
      query,
      [
        assetId,
        ticketId,
      ]
    );

  return result.rows[0];
};

/* =========================================
   HISTORY
========================================= */

const findTicketHistory = async (
  ticketId
) => {
  const query = `
    SELECT
      tsh.id,
      tsh.ticket_id,
      tsh.old_status,
      tsh.new_status,
      tsh.note,
      tsh.changed_at,

      u.id AS changed_by,

      u.full_name
        AS changed_by_name,

      r.name
        AS changed_by_role

    FROM ticket_status_history tsh

    JOIN users u
      ON tsh.changed_by = u.id

    JOIN roles r
      ON u.role_id = r.id

    WHERE tsh.ticket_id = $1

    ORDER BY
      tsh.changed_at ASC
  `;

  const result =
    await pool.query(
      query,
      [ticketId]
    );

  return result.rows;
};

/* =========================================
   EXPORTS
========================================= */

module.exports = {
  findCategoryById,

  findAllCategories,

  createTicket,

  findTicketsByUserId,

  findAllTickets,

  findTicketById,

  findUserByIdWithRole,

  assignTicket,

  updateTicketStatus,

  createComment,

  findCommentsByTicketId,

  findRatingByTicketId,

  createRating,

  linkAssetToTicket,

  findTicketHistory,
};