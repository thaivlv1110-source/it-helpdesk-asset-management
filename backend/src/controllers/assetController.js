const assetService =
  require("../services/assetService");

/* =========================================
   METADATA
========================================= */

const getCategories = async (
  req,
  res
) => {
  try {
    const categories =
      await assetService.getCategories();

    return res.status(200).json({
      message:
        "Asset categories retrieved successfully",

      data:
        categories,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Internal server error",
    });
  }
};

const getLocations = async (
  req,
  res
) => {
  try {
    const locations =
      await assetService.getLocations();

    return res.status(200).json({
      message:
        "Locations retrieved successfully",

      data:
        locations,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Internal server error",
    });
  }
};

/* =========================================
   CREATE
========================================= */

const createAsset = async (
  req,
  res
) => {
  try {
    const {
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
    } = req.body;

    const asset =
      await assetService.createAsset({
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
      });

    return res.status(201).json({
      message:
        "Asset created successfully",

      data:
        asset,
    });
  } catch (error) {
    if (
      error.message ===
      "MISSING_REQUIRED_FIELDS"
    ) {
      return res.status(400).json({
        message:
          "assetCode, assetName and categoryId are required",
      });
    }

    if (
      error.message ===
      "CATEGORY_NOT_FOUND"
    ) {
      return res.status(404).json({
        message:
          "Asset category not found",
      });
    }

    if (
      error.message ===
      "LOCATION_NOT_FOUND"
    ) {
      return res.status(404).json({
        message:
          "Location not found",
      });
    }

    if (
      error.code === "23505"
    ) {
      return res.status(409).json({
        message:
          "Asset code or serial number already exists",
      });
    }

    console.error(error);

    return res.status(500).json({
      message:
        "Internal server error",
    });
  }
};

/* =========================================
   LIST
========================================= */

const getAssets = async (
  req,
  res
) => {
  try {
    const {
      status,
      categoryId,
      locationId,
      search,
    } = req.query;

    const assets =
      await assetService.getAssets({
        userId:
          req.user.userId,

        role:
          req.user.role,

        status,
        categoryId,
        locationId,
        search,
      });

    return res.status(200).json({
      message:
        "Assets retrieved successfully",

      data:
        assets,
    });
  } catch (error) {
    if (
      error.message ===
      "INVALID_STATUS_FILTER"
    ) {
      return res.status(400).json({
        message:
          "Invalid asset status filter",
      });
    }

    if (
      error.message ===
      "INVALID_CATEGORY_FILTER"
    ) {
      return res.status(400).json({
        message:
          "Invalid categoryId filter",
      });
    }

    if (
      error.message ===
      "INVALID_LOCATION_FILTER"
    ) {
      return res.status(400).json({
        message:
          "Invalid locationId filter",
      });
    }

    console.error(error);

    return res.status(500).json({
      message:
        "Internal server error",
    });
  }
};

/* =========================================
   DETAIL
========================================= */

const getAssetById = async (
  req,
  res
) => {
  try {
    const assetId =
      Number(req.params.id);

    if (
      !Number.isInteger(
        assetId
      ) ||
      assetId <= 0
    ) {
      return res.status(400).json({
        message:
          "Invalid asset id",
      });
    }

    const asset =
      await assetService.getAssetById({
        assetId,

        userId:
          req.user.userId,

        role:
          req.user.role,
      });

    return res.status(200).json({
      message:
        "Asset retrieved successfully",

      data:
        asset,
    });
  } catch (error) {
    if (
      error.message ===
      "ASSET_NOT_FOUND"
    ) {
      return res.status(404).json({
        message:
          "Asset not found",
      });
    }

    if (
      error.message ===
      "FORBIDDEN"
    ) {
      return res.status(403).json({
        message:
          "You do not have permission to view this asset",
      });
    }

    console.error(error);

    return res.status(500).json({
      message:
        "Internal server error",
    });
  }
};

/* =========================================
   ASSIGN
========================================= */

const assignAsset = async (
  req,
  res
) => {
  try {
    const assetId =
      Number(req.params.id);

    const assigneeId =
      Number(
        req.body.assigneeId
      );

    const {
      note,
    } = req.body;

    if (
      !Number.isInteger(
        assetId
      ) ||
      assetId <= 0
    ) {
      return res.status(400).json({
        message:
          "Invalid asset id",
      });
    }

    if (
      !Number.isInteger(
        assigneeId
      ) ||
      assigneeId <= 0
    ) {
      return res.status(400).json({
        message:
          "Valid assigneeId is required",
      });
    }

    const assignment =
      await assetService.assignAsset({
        assetId,

        assigneeId,

        currentUserId:
          req.user.userId,

        note,
      });

    return res.status(200).json({
      message:
        "Asset assigned successfully",

      data:
        assignment,
    });
  } catch (error) {
    if (
      error.message ===
      "ASSET_NOT_FOUND"
    ) {
      return res.status(404).json({
        message:
          "Asset not found",
      });
    }

    if (
      error.message ===
      "ASSET_NOT_AVAILABLE"
    ) {
      return res.status(409).json({
        message:
          "Asset is not available",
      });
    }

    if (
      error.message ===
      "ASSET_ALREADY_ASSIGNED"
    ) {
      return res.status(409).json({
        message:
          "Asset is already assigned",
      });
    }

    if (
      error.message ===
      "ASSIGNEE_NOT_FOUND"
    ) {
      return res.status(404).json({
        message:
          "Assignee not found",
      });
    }

    if (
      error.message ===
      "ASSIGNEE_INACTIVE"
    ) {
      return res.status(400).json({
        message:
          "Assignee account is inactive",
      });
    }

    if (
      error.message ===
      "ASSIGNEE_NOT_EMPLOYEE"
    ) {
      return res.status(400).json({
        message:
          "Asset can only be assigned to an employee",
      });
    }

    console.error(error);

    return res.status(500).json({
      message:
        "Internal server error",
    });
  }
};

/* =========================================
   RETURN
========================================= */

const returnAsset = async (
  req,
  res
) => {
  try {
    const assetId =
      Number(req.params.id);

    const {
      note,
    } = req.body;

    if (
      !Number.isInteger(
        assetId
      ) ||
      assetId <= 0
    ) {
      return res.status(400).json({
        message:
          "Invalid asset id",
      });
    }

    const assignment =
      await assetService.returnAsset({
        assetId,
        note,
      });

    return res.status(200).json({
      message:
        "Asset returned successfully",

      data:
        assignment,
    });
  } catch (error) {
    if (
      error.message ===
      "ASSET_NOT_FOUND"
    ) {
      return res.status(404).json({
        message:
          "Asset not found",
      });
    }

    if (
      error.message ===
      "ACTIVE_ASSIGNMENT_NOT_FOUND"
    ) {
      return res.status(409).json({
        message:
          "Asset does not have an active assignment",
      });
    }

    console.error(error);

    return res.status(500).json({
      message:
        "Internal server error",
    });
  }
};

/* =========================================
   HISTORY
========================================= */

const getAssetHistory = async (
  req,
  res
) => {
  try {
    const assetId =
      Number(req.params.id);

    if (
      !Number.isInteger(
        assetId
      ) ||
      assetId <= 0
    ) {
      return res.status(400).json({
        message:
          "Invalid asset id",
      });
    }

    const history =
      await assetService.getAssetHistory({
        assetId,

        userId:
          req.user.userId,

        role:
          req.user.role,
      });

    return res.status(200).json({
      message:
        "Asset assignment history retrieved successfully",

      data:
        history,
    });
  } catch (error) {
    if (
      error.message ===
      "ASSET_NOT_FOUND"
    ) {
      return res.status(404).json({
        message:
          "Asset not found",
      });
    }

    if (
      error.message ===
      "FORBIDDEN"
    ) {
      return res.status(403).json({
        message:
          "You do not have permission to view this asset history",
      });
    }

    console.error(error);

    return res.status(500).json({
      message:
        "Internal server error",
    });
  }
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