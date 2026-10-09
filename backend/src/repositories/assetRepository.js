const pool = require("../config/db");

/* =========================================
   METADATA
========================================= */

const findCategoryById = async (categoryId) => {
  const query = `
    SELECT id, name
    FROM asset_categories
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [categoryId]);

  return result.rows[0];
};

const findAllCategories = async () => {
  const query = `
    SELECT id, name
    FROM asset_categories
    ORDER BY name ASC
  `;

  const result = await pool.query(query);

  return result.rows;
};

const findLocationById = async (locationId) => {
  const query = `
    SELECT id, name
    FROM locations
    WHERE id = $1
    LIMIT 1
  `;

  const result = await pool.query(query, [locationId]);

  return result.rows[0];
};

const findAllLocations = async () => {
  const query = `
    SELECT id, name
    FROM locations
    ORDER BY name ASC
  `;

  const result = await pool.query(query);

  return result.rows;
};

/* =========================================
   USER
========================================= */

const findUserByIdWithRole = async (userId) => {
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

  const result = await pool.query(query, [userId]);

  return result.rows[0];
};

/* =========================================
   CREATE ASSET
========================================= */

const createAsset = async ({
  assetCode,
  assetName,
  categoryId,
  brand,
  model,
  serialNumber,
  purchaseDate,
  warrantyExpiration,
  locationId,
  notes,
}) => {
  const query = `
    INSERT INTO assets (
      asset_code,
      asset_name,
      category_id,
      brand,
      model,
      serial_number,
      purchase_date,
      warranty_expiration,
      location_id,
      notes
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10
    )
    RETURNING *
  `;

  const result = await pool.query(query, [
    assetCode,
    assetName,
    categoryId,
    brand || null,
    model || null,
    serialNumber || null,
    purchaseDate || null,
    warrantyExpiration || null,
    locationId || null,
    notes || null,
  ]);

  return result.rows[0];
};

/* =========================================
   ALL ASSETS
========================================= */

const findAllAssets = async ({
  status,
  categoryId,
  locationId,
  search,
}) => {
  const conditions = [];
  const values = [];

  let paramIndex = 1;

  if (status) {
    conditions.push(
      `a.status = $${paramIndex}`
    );

    values.push(status);
    paramIndex++;
  }

  if (categoryId) {
    conditions.push(
      `a.category_id = $${paramIndex}`
    );

    values.push(categoryId);
    paramIndex++;
  }

  if (locationId) {
    conditions.push(
      `a.location_id = $${paramIndex}`
    );

    values.push(locationId);
    paramIndex++;
  }

  if (search) {
    conditions.push(`
      (
        a.asset_code ILIKE $${paramIndex}
        OR a.asset_name ILIKE $${paramIndex}
        OR a.brand ILIKE $${paramIndex}
        OR a.model ILIKE $${paramIndex}
        OR a.serial_number ILIKE $${paramIndex}
      )
    `);

    values.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  const query = `
    SELECT
      a.id,
      a.asset_code,
      a.asset_name,
      a.brand,
      a.model,
      a.serial_number,
      a.purchase_date,
      a.warranty_expiration,
      a.status,
      a.notes,
      a.created_at,
      a.updated_at,

      ac.id AS category_id,
      ac.name AS category,

      l.id AS location_id,
      l.name AS location,

      aa.user_id AS assigned_to,
      u.full_name AS assigned_to_name

    FROM assets a

    JOIN asset_categories ac
      ON a.category_id = ac.id

    LEFT JOIN locations l
      ON a.location_id = l.id

    LEFT JOIN asset_assignments aa
      ON a.id = aa.asset_id
      AND aa.returned_at IS NULL

    LEFT JOIN users u
      ON aa.user_id = u.id

    ${whereClause}

    ORDER BY a.id DESC
  `;

  const result = await pool.query(
    query,
    values
  );

  return result.rows;
};

/* =========================================
   EMPLOYEE ASSETS
========================================= */

const findAssetsByUserId = async ({
  userId,
  status,
  categoryId,
  locationId,
  search,
}) => {
  const conditions = [
    "aa.user_id = $1",
    "aa.returned_at IS NULL",
  ];

  const values = [userId];

  let paramIndex = 2;

  if (status) {
    conditions.push(
      `a.status = $${paramIndex}`
    );

    values.push(status);
    paramIndex++;
  }

  if (categoryId) {
    conditions.push(
      `a.category_id = $${paramIndex}`
    );

    values.push(categoryId);
    paramIndex++;
  }

  if (locationId) {
    conditions.push(
      `a.location_id = $${paramIndex}`
    );

    values.push(locationId);
    paramIndex++;
  }

  if (search) {
    conditions.push(`
      (
        a.asset_code ILIKE $${paramIndex}
        OR a.asset_name ILIKE $${paramIndex}
        OR a.brand ILIKE $${paramIndex}
        OR a.model ILIKE $${paramIndex}
        OR a.serial_number ILIKE $${paramIndex}
      )
    `);

    values.push(`%${search}%`);
    paramIndex++;
  }

  const query = `
    SELECT
      a.id,
      a.asset_code,
      a.asset_name,
      a.brand,
      a.model,
      a.serial_number,
      a.purchase_date,
      a.warranty_expiration,
      a.status,
      a.notes,
      a.created_at,
      a.updated_at,

      ac.id AS category_id,
      ac.name AS category,

      l.id AS location_id,
      l.name AS location,

      aa.assigned_at

    FROM assets a

    JOIN asset_categories ac
      ON a.category_id = ac.id

    LEFT JOIN locations l
      ON a.location_id = l.id

    JOIN asset_assignments aa
      ON a.id = aa.asset_id

    WHERE
      ${conditions.join(" AND ")}

    ORDER BY aa.assigned_at DESC
  `;

  const result = await pool.query(
    query,
    values
  );

  return result.rows;
};

/* =========================================
   ASSET DETAIL
========================================= */

const findAssetById = async (assetId) => {
  const query = `
    SELECT
      a.id,
      a.asset_code,
      a.asset_name,
      a.brand,
      a.model,
      a.serial_number,
      a.purchase_date,
      a.warranty_expiration,
      a.status,
      a.notes,
      a.created_at,
      a.updated_at,

      ac.id AS category_id,
      ac.name AS category,

      l.id AS location_id,
      l.name AS location,

      aa.id AS assignment_id,
      aa.user_id AS assigned_to,
      aa.assigned_at,

      u.full_name AS assigned_to_name,
      u.email AS assigned_to_email

    FROM assets a

    JOIN asset_categories ac
      ON a.category_id = ac.id

    LEFT JOIN locations l
      ON a.location_id = l.id

    LEFT JOIN asset_assignments aa
      ON a.id = aa.asset_id
      AND aa.returned_at IS NULL

    LEFT JOIN users u
      ON aa.user_id = u.id

    WHERE a.id = $1

    LIMIT 1
  `;

  const result = await pool.query(
    query,
    [assetId]
  );

  return result.rows[0];
};

/* =========================================
   ACTIVE ASSIGNMENT
========================================= */

const findActiveAssignment = async (assetId) => {
  const query = `
    SELECT
      id,
      asset_id,
      user_id,
      assigned_by,
      assigned_at,
      returned_at,
      note
    FROM asset_assignments
    WHERE asset_id = $1
      AND returned_at IS NULL
    LIMIT 1
  `;

  const result = await pool.query(
    query,
    [assetId]
  );

  return result.rows[0];
};

/* =========================================
   ASSIGN
========================================= */

const assignAsset = async ({
  assetId,
  userId,
  assignedBy,
  note,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const assetResult =
      await client.query(
        `
          SELECT id, status
          FROM assets
          WHERE id = $1
          FOR UPDATE
        `,
        [assetId]
      );

    const asset =
      assetResult.rows[0];

    if (!asset) {
      throw new Error(
        "ASSET_NOT_FOUND"
      );
    }

    const assignmentResult =
      await client.query(
        `
          SELECT id
          FROM asset_assignments
          WHERE asset_id = $1
            AND returned_at IS NULL
          LIMIT 1
        `,
        [assetId]
      );

    if (
      assignmentResult.rows[0]
    ) {
      throw new Error(
        "ASSET_ALREADY_ASSIGNED"
      );
    }

    if (
      asset.status !==
      "AVAILABLE"
    ) {
      throw new Error(
        "ASSET_NOT_AVAILABLE"
      );
    }

    const newAssignmentResult =
      await client.query(
        `
          INSERT INTO asset_assignments (
            asset_id,
            user_id,
            assigned_by,
            note
          )
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `,
        [
          assetId,
          userId,
          assignedBy,
          note || null,
        ]
      );

    await client.query(
      `
        UPDATE assets
        SET
          status = 'ASSIGNED',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `,
      [assetId]
    );

    await client.query("COMMIT");

    return newAssignmentResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
};

/* =========================================
   RETURN
========================================= */

const returnAsset = async ({
  assetId,
  note,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const assetResult =
      await client.query(
        `
          SELECT id, status
          FROM assets
          WHERE id = $1
          FOR UPDATE
        `,
        [assetId]
      );

    const asset =
      assetResult.rows[0];

    if (!asset) {
      throw new Error(
        "ASSET_NOT_FOUND"
      );
    }

    const assignmentResult =
      await client.query(
        `
          SELECT *
          FROM asset_assignments
          WHERE asset_id = $1
            AND returned_at IS NULL
          LIMIT 1
          FOR UPDATE
        `,
        [assetId]
      );

    const assignment =
      assignmentResult.rows[0];

    if (!assignment) {
      throw new Error(
        "ACTIVE_ASSIGNMENT_NOT_FOUND"
      );
    }

    const returnResult =
      await client.query(
        `
          UPDATE asset_assignments
          SET
            returned_at = CURRENT_TIMESTAMP,

            note = CASE
              WHEN $1::TEXT IS NULL
                THEN note

              WHEN note IS NULL
                THEN $1::TEXT

              ELSE
                note ||
                ' | Return: ' ||
                $1::TEXT
            END

          WHERE id = $2

          RETURNING *
        `,
        [
          note?.trim() || null,
          assignment.id,
        ]
      );

    await client.query(
      `
        UPDATE assets
        SET
          status = 'AVAILABLE',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `,
      [assetId]
    );

    await client.query("COMMIT");

    return returnResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
};

/* =========================================
   HISTORY
========================================= */

const findAssignmentHistory = async (assetId) => {
  const query = `
    SELECT
      aa.id,
      aa.asset_id,
      aa.user_id,

      u.full_name AS assigned_to_name,
      u.email AS assigned_to_email,

      aa.assigned_by,
      admin.full_name AS assigned_by_name,

      aa.assigned_at,
      aa.returned_at,
      aa.note

    FROM asset_assignments aa

    JOIN users u
      ON aa.user_id = u.id

    JOIN users admin
      ON aa.assigned_by = admin.id

    WHERE aa.asset_id = $1

    ORDER BY aa.assigned_at DESC
  `;

  const result = await pool.query(
    query,
    [assetId]
  );

  return result.rows;
};

module.exports = {
  findCategoryById,
  findAllCategories,

  findLocationById,
  findAllLocations,

  findUserByIdWithRole,

  createAsset,

  findAllAssets,
  findAssetsByUserId,

  findAssetById,
  findActiveAssignment,

  assignAsset,
  returnAsset,

  findAssignmentHistory,
};