const express = require("express");

const supportController =
  require("../controllers/supportController");

const {
  authenticateToken,
} = require("../middlewares/authMiddleware");

const {
  authorizeRoles,
} = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get(
  "/tickets",
  authenticateToken,
  authorizeRoles("IT_SUPPORT"),
  supportController.getMyQueue
);

module.exports = router;