const express =
  require("express");

const adminController =
  require("../controllers/adminController");

const authMiddleware =
  require("../middlewares/authMiddleware");

const {
  authorizeRoles,
} = require("../middlewares/roleMiddleware");

const router =
  express.Router();

/* =========================================
   ADMIN ONLY
========================================= */

router.use(
  authMiddleware
);

router.use(
  authorizeRoles(
    "ADMIN"
  )
);

/* =========================================
   METADATA
========================================= */

router.get(
  "/departments",

  adminController.getDepartments
);

router.get(
  "/roles",

  adminController.getRoles
);

/* =========================================
   USERS
========================================= */

router.get(
  "/users",

  adminController.getAllUsers
);

router.post(
  "/users",

  adminController.createUser
);

router.get(
  "/users/:id",

  adminController.getUserById
);

router.patch(
  "/users/:id/status",

  adminController.updateUserStatus
);

module.exports =
  router;