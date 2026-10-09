const express =
  require("express");

const assetController =
  require("../controllers/assetController");

const {
  authenticateToken,
} = require("../middlewares/authMiddleware");

const {
  authorizeRoles,
} = require("../middlewares/roleMiddleware");

const router =
  express.Router();

/* =========================================
   METADATA
========================================= */

router.get(
  "/categories",

  authenticateToken,

  authorizeRoles(
    "EMPLOYEE",
    "IT_SUPPORT",
    "ADMIN"
  ),

  assetController.getCategories
);

router.get(
  "/locations",

  authenticateToken,

  authorizeRoles(
    "EMPLOYEE",
    "IT_SUPPORT",
    "ADMIN"
  ),

  assetController.getLocations
);

/* =========================================
   LIST
========================================= */

router.get(
  "/",

  authenticateToken,

  authorizeRoles(
    "EMPLOYEE",
    "IT_SUPPORT",
    "ADMIN"
  ),

  assetController.getAssets
);

/* =========================================
   CREATE
========================================= */

router.post(
  "/",

  authenticateToken,

  authorizeRoles(
    "ADMIN"
  ),

  assetController.createAsset
);

/* =========================================
   ASSIGN / RETURN
========================================= */

router.post(
  "/:id/assign",

  authenticateToken,

  authorizeRoles(
    "ADMIN"
  ),

  assetController.assignAsset
);

router.post(
  "/:id/return",

  authenticateToken,

  authorizeRoles(
    "ADMIN"
  ),

  assetController.returnAsset
);

/* =========================================
   HISTORY
========================================= */

router.get(
  "/:id/history",

  authenticateToken,

  authorizeRoles(
    "EMPLOYEE",
    "IT_SUPPORT",
    "ADMIN"
  ),

  assetController.getAssetHistory
);

/* =========================================
   DETAIL - LUÔN ĐỂ CUỐI
========================================= */

router.get(
  "/:id",

  authenticateToken,

  authorizeRoles(
    "EMPLOYEE",
    "IT_SUPPORT",
    "ADMIN"
  ),

  assetController.getAssetById
);

module.exports =
  router;