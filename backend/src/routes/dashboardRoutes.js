const express = require("express");

const dashboardController =
  require("../controllers/dashboardController");

const {
  authenticateToken,
} = require("../middlewares/authMiddleware");

const {
  authorizeRoles,
} = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN"),
  dashboardController.getDashboard
);

module.exports = router;