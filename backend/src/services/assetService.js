const assetRepository =
  require("../repositories/assetRepository");

const ALLOWED_ASSET_STATUSES = [
  "AVAILABLE",
  "ASSIGNED",
  "MAINTENANCE",
  "RETIRED",
];

/* =========================================
   METADATA
========================================= */

const getCategories = async () => {
  return assetRepository.findAllCategories();
};

const getLocations = async () => {
  return assetRepository.findAllLocations();
};

/* =========================================
   CREATE
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
  if (
    !assetCode ||
    !assetName ||
    !categoryId
  ) {
    throw new Error(
      "MISSING_REQUIRED_FIELDS"
    );
  }

  const normalizedCategoryId =
    Number(categoryId);

  if (
    !Number.isInteger(
      normalizedCategoryId
    ) ||
    normalizedCategoryId <= 0
  ) {
    throw new Error(
      "CATEGORY_NOT_FOUND"
    );
  }

  const category =
    await assetRepository.findCategoryById(
      normalizedCategoryId
    );

  if (!category) {
    throw new Error(
      "CATEGORY_NOT_FOUND"
    );
  }

  let normalizedLocationId =
    null;

  if (locationId) {
    normalizedLocationId =
      Number(locationId);

    const location =
      await assetRepository.findLocationById(
        normalizedLocationId
      );

    if (!location) {
      throw new Error(
        "LOCATION_NOT_FOUND"
      );
    }
  }

  return assetRepository.createAsset({
    assetCode:
      assetCode.trim(),

    assetName:
      assetName.trim(),

    categoryId:
      normalizedCategoryId,

    brand:
      brand?.trim(),

    model:
      model?.trim(),

    serialNumber:
      serialNumber?.trim(),

    purchaseDate,

    warrantyExpiration,

    locationId:
      normalizedLocationId,

    notes:
      notes?.trim(),
  });
};

/* =========================================
   FILTER
========================================= */

const normalizeFilters = ({
  status,
  categoryId,
  locationId,
  search,
}) => {
  let normalizedStatus = null;
  let normalizedCategoryId = null;
  let normalizedLocationId = null;

  if (status) {
    normalizedStatus =
      status.toUpperCase();

    if (
      !ALLOWED_ASSET_STATUSES.includes(
        normalizedStatus
      )
    ) {
      throw new Error(
        "INVALID_STATUS_FILTER"
      );
    }
  }

  if (
    categoryId !== undefined &&
    categoryId !== ""
  ) {
    normalizedCategoryId =
      Number(categoryId);

    if (
      !Number.isInteger(
        normalizedCategoryId
      ) ||
      normalizedCategoryId <= 0
    ) {
      throw new Error(
        "INVALID_CATEGORY_FILTER"
      );
    }
  }

  if (
    locationId !== undefined &&
    locationId !== ""
  ) {
    normalizedLocationId =
      Number(locationId);

    if (
      !Number.isInteger(
        normalizedLocationId
      ) ||
      normalizedLocationId <= 0
    ) {
      throw new Error(
        "INVALID_LOCATION_FILTER"
      );
    }
  }

  return {
    status:
      normalizedStatus,

    categoryId:
      normalizedCategoryId,

    locationId:
      normalizedLocationId,

    search:
      search?.trim() || null,
  };
};

/* =========================================
   LIST
========================================= */

const getAssets = async ({
  userId,
  role,
  status,
  categoryId,
  locationId,
  search,
}) => {
  const filters =
    normalizeFilters({
      status,
      categoryId,
      locationId,
      search,
    });

  if (
    role === "EMPLOYEE"
  ) {
    return assetRepository.findAssetsByUserId({
      userId,
      ...filters,
    });
  }

  return assetRepository.findAllAssets(
    filters
  );
};

/* =========================================
   DETAIL
========================================= */

const getAssetById = async ({
  assetId,
  userId,
  role,
}) => {
  const asset =
    await assetRepository.findAssetById(
      assetId
    );

  if (!asset) {
    throw new Error(
      "ASSET_NOT_FOUND"
    );
  }

  if (
    role === "EMPLOYEE" &&
    Number(asset.assigned_to) !==
      Number(userId)
  ) {
    throw new Error(
      "FORBIDDEN"
    );
  }

  return asset;
};

/* =========================================
   ASSIGN
========================================= */

const assignAsset = async ({
  assetId,
  assigneeId,
  currentUserId,
  note,
}) => {
  const asset =
    await assetRepository.findAssetById(
      assetId
    );

  if (!asset) {
    throw new Error(
      "ASSET_NOT_FOUND"
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

  const user =
    await assetRepository.findUserByIdWithRole(
      assigneeId
    );

  if (!user) {
    throw new Error(
      "ASSIGNEE_NOT_FOUND"
    );
  }

  if (!user.is_active) {
    throw new Error(
      "ASSIGNEE_INACTIVE"
    );
  }

  if (
    user.role !==
    "EMPLOYEE"
  ) {
    throw new Error(
      "ASSIGNEE_NOT_EMPLOYEE"
    );
  }

  const activeAssignment =
    await assetRepository.findActiveAssignment(
      assetId
    );

  if (activeAssignment) {
    throw new Error(
      "ASSET_ALREADY_ASSIGNED"
    );
  }

  return assetRepository.assignAsset({
    assetId,

    userId:
      assigneeId,

    assignedBy:
      currentUserId,

    note:
      note?.trim(),
  });
};

/* =========================================
   RETURN
========================================= */

const returnAsset = async ({
  assetId,
  note,
}) => {
  const asset =
    await assetRepository.findAssetById(
      assetId
    );

  if (!asset) {
    throw new Error(
      "ASSET_NOT_FOUND"
    );
  }

  const assignment =
    await assetRepository.findActiveAssignment(
      assetId
    );

  if (!assignment) {
    throw new Error(
      "ACTIVE_ASSIGNMENT_NOT_FOUND"
    );
  }

  return assetRepository.returnAsset({
    assetId,
    note:
      note?.trim(),
  });
};

/* =========================================
   HISTORY
========================================= */

const getAssetHistory = async ({
  assetId,
  userId,
  role,
}) => {
  const asset =
    await assetRepository.findAssetById(
      assetId
    );

  if (!asset) {
    throw new Error(
      "ASSET_NOT_FOUND"
    );
  }

  if (
    role === "EMPLOYEE" &&
    Number(asset.assigned_to) !==
      Number(userId)
  ) {
    throw new Error(
      "FORBIDDEN"
    );
  }

  return assetRepository.findAssignmentHistory(
    assetId
  );
};

module.exports = {
  getCategories,
  getLocations,

  createAsset,

  getAssets,
  getAssetById,

  assignAsset,
  returnAsset,

  getAssetHistory,
};