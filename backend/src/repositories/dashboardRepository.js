const pool = require("../config/db");

const getTicketSummary = async () => {
  const query = `
    SELECT
      COUNT(*)::INTEGER AS total,

      COUNT(*) FILTER (
        WHERE status = 'OPEN'
      )::INTEGER AS open,

      COUNT(*) FILTER (
        WHERE status = 'ASSIGNED'
      )::INTEGER AS assigned,

      COUNT(*) FILTER (
        WHERE status = 'IN_PROGRESS'
      )::INTEGER AS in_progress,

      COUNT(*) FILTER (
        WHERE status = 'WAITING_FOR_USER'
      )::INTEGER AS waiting_for_user,

      COUNT(*) FILTER (
        WHERE status = 'RESOLVED'
      )::INTEGER AS resolved,

      COUNT(*) FILTER (
        WHERE status = 'CLOSED'
      )::INTEGER AS closed

    FROM tickets
  `;

  const result = await pool.query(query);

  return result.rows[0];
};

const getAssetSummary = async () => {
  const query = `
    SELECT
      COUNT(*)::INTEGER AS total,

      COUNT(*) FILTER (
        WHERE status = 'AVAILABLE'
      )::INTEGER AS available,

      COUNT(*) FILTER (
        WHERE status = 'ASSIGNED'
      )::INTEGER AS assigned,

      COUNT(*) FILTER (
        WHERE status = 'MAINTENANCE'
      )::INTEGER AS maintenance,

      COUNT(*) FILTER (
        WHERE status = 'RETIRED'
      )::INTEGER AS retired

    FROM assets
  `;

  const result = await pool.query(query);

  return result.rows[0];
};

const getUserSummary = async () => {
  const query = `
    SELECT
      COUNT(*)::INTEGER AS total,

      COUNT(*) FILTER (
        WHERE is_active = TRUE
      )::INTEGER AS active,

      COUNT(*) FILTER (
        WHERE is_active = FALSE
      )::INTEGER AS inactive

    FROM users
  `;

  const result = await pool.query(query);

  return result.rows[0];
};

const getAverageRating = async () => {
  const query = `
    SELECT
      COUNT(*)::INTEGER AS total_ratings,

      COALESCE(
        ROUND(AVG(rating)::NUMERIC, 2),
        0
      ) AS average_rating

    FROM ticket_ratings
  `;

  const result = await pool.query(query);

  return result.rows[0];
};

const getRecentTickets = async () => {
  const query = `
    SELECT
      t.id,
      t.ticket_code,
      t.title,
      t.priority,
      t.status,
      t.created_at,

      u.full_name AS created_by_name

    FROM tickets t

    JOIN users u
      ON t.created_by = u.id

    ORDER BY t.created_at DESC

    LIMIT 10
  `;

  const result = await pool.query(query);

  return result.rows;
};

module.exports = {
  getTicketSummary,
  getAssetSummary,
  getUserSummary,
  getAverageRating,
  getRecentTickets,
};