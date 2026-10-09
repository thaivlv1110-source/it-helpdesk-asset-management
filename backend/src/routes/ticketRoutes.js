const express = require(
  "express"
);

const ticketController = require(
  "../controllers/ticketController"
);

const authMiddleware = require(
  "../middlewares/authMiddleware"
);

const {
  authorizeRoles,
} = require(
  "../middlewares/roleMiddleware"
);

const router =
  express.Router();

router.use(
  authMiddleware
);

/* CATEGORY */
router.get(
  "/categories",
  authorizeRoles(
    "EMPLOYEE",
    "IT_SUPPORT",
    "ADMIN"
  ),
  ticketController
    .getTicketCategories
);

/* EMPLOYEE CREATE */
router.post(
  "/",
  authorizeRoles(
    "EMPLOYEE"
  ),
  ticketController
    .createTicket
);

/* EMPLOYEE LIST */
router.get(
  "/my",
  authorizeRoles(
    "EMPLOYEE"
  ),
  ticketController
    .getMyTickets
);

/* ADMIN LIST */
router.get(
  "/",
  authorizeRoles(
    "ADMIN"
  ),
  ticketController
    .getAllTickets
);

/* ADMIN ASSIGN */
router.post(
  "/:id/assign",
  authorizeRoles(
    "ADMIN"
  ),
  ticketController
    .assignTicket
);

/* STATUS */
router.patch(
  "/:id/status",
  authorizeRoles(
    "EMPLOYEE",
    "IT_SUPPORT"
  ),
  ticketController
    .updateTicketStatus
);

/* COMMENTS */
router.post(
  "/:id/comments",
  authorizeRoles(
    "EMPLOYEE",
    "IT_SUPPORT",
    "ADMIN"
  ),
  ticketController
    .addComment
);

router.get(
  "/:id/comments",
  authorizeRoles(
    "EMPLOYEE",
    "IT_SUPPORT",
    "ADMIN"
  ),
  ticketController
    .getComments
);

/* RATING */
router.post(
  "/:id/rating",
  authorizeRoles(
    "EMPLOYEE"
  ),
  ticketController
    .createRating
);

router.get(
  "/:id/rating",
  authorizeRoles(
    "EMPLOYEE",
    "IT_SUPPORT",
    "ADMIN"
  ),
  ticketController
    .getRating
);

/* LINK ASSET */
router.patch(
  "/:id/asset",
  authorizeRoles(
    "EMPLOYEE",
    "IT_SUPPORT",
    "ADMIN"
  ),
  ticketController
    .updateTicketAsset
);

/* HISTORY */
router.get(
  "/:id/history",
  authorizeRoles(
    "EMPLOYEE",
    "IT_SUPPORT",
    "ADMIN"
  ),
  ticketController
    .getTicketHistory
);

/*
  DETAIL phải nằm cuối.
*/
router.get(
  "/:id",
  authorizeRoles(
    "EMPLOYEE",
    "IT_SUPPORT",
    "ADMIN"
  ),
  ticketController
    .getTicketById
);

module.exports = router;