const ticketRepository = require(
  "../repositories/ticketRepository"
);

const VALID_STATUSES = [
  "OPEN",
  "ASSIGNED",
  "IN_PROGRESS",
  "WAITING_FOR_USER",
  "RESOLVED",
  "CLOSED",
];

const VALID_PRIORITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];

const createServiceError = (
  message,
  statusCode
) => {
  const error = new Error(message);

  error.statusCode = statusCode;

  return error;
};

const parsePositiveInteger = (
  value,
  fieldName
) => {
  const parsed =
    Number(value);

  if (
    !Number.isInteger(parsed) ||
    parsed <= 0
  ) {
    throw createServiceError(
      `Invalid ${fieldName}`,
      400
    );
  }

  return parsed;
};

const normalizeSearch = (
  search
) => {
  if (
    typeof search !== "string"
  ) {
    return undefined;
  }

  const value =
    search.trim();

  return value || undefined;
};

const validateFilters = ({
  status,
  priority,
  categoryId,
}) => {
  if (
    status &&
    !VALID_STATUSES.includes(
      status
    )
  ) {
    throw createServiceError(
      "Invalid ticket status",
      400
    );
  }

  if (
    priority &&
    !VALID_PRIORITIES.includes(
      priority
    )
  ) {
    throw createServiceError(
      "Invalid ticket priority",
      400
    );
  }

  let parsedCategoryId;

  if (
    categoryId !== undefined &&
    categoryId !== null &&
    categoryId !== ""
  ) {
    parsedCategoryId =
      parsePositiveInteger(
        categoryId,
        "categoryId"
      );
  }

  return {
    status,
    priority,
    categoryId:
      parsedCategoryId,
  };
};

/* =========================================
   CATEGORIES
========================================= */

const getTicketCategories =
  async () => {
    return await ticketRepository
      .findAllCategories();
  };

/* =========================================
   CREATE
========================================= */

const createTicket = async ({
  title,
  description,
  categoryId,
  priority,
  createdBy,
}) => {
  if (
    !title ||
    !description ||
    !categoryId ||
    !priority
  ) {
    throw createServiceError(
      "Title, description, categoryId and priority are required",
      400
    );
  }

  const cleanTitle =
    String(title).trim();

  const cleanDescription =
    String(description).trim();

  if (
    cleanTitle.length < 3
  ) {
    throw createServiceError(
      "Ticket title must contain at least 3 characters",
      400
    );
  }

  if (
    cleanDescription.length < 5
  ) {
    throw createServiceError(
      "Ticket description must contain at least 5 characters",
      400
    );
  }

  const parsedCategoryId =
    parsePositiveInteger(
      categoryId,
      "categoryId"
    );

  if (
    !VALID_PRIORITIES.includes(
      priority
    )
  ) {
    throw createServiceError(
      "Invalid ticket priority",
      400
    );
  }

  const category =
    await ticketRepository
      .findCategoryById(
        parsedCategoryId
      );

  if (!category) {
    throw createServiceError(
      "Ticket category not found",
      404
    );
  }

  const ticketCode =
    `TCK-${Date.now()}`;

  return await ticketRepository
    .createTicket({
      ticketCode,
      title: cleanTitle,
      description:
        cleanDescription,
      categoryId:
        parsedCategoryId,
      priority,
      createdBy,
    });
};

/* =========================================
   EMPLOYEE LIST
========================================= */

const getMyTickets = async ({
  userId,
  status,
  priority,
  categoryId,
  search,
}) => {
  const filters =
    validateFilters({
      status,
      priority,
      categoryId,
    });

  return await ticketRepository
    .findTicketsByUserId({
      userId,
      status:
        filters.status,
      priority:
        filters.priority,
      categoryId:
        filters.categoryId,
      search:
        normalizeSearch(
          search
        ),
    });
};

/* =========================================
   ADMIN LIST
========================================= */

const getAllTickets = async ({
  status,
  priority,
  categoryId,
  search,
}) => {
  const filters =
    validateFilters({
      status,
      priority,
      categoryId,
    });

  return await ticketRepository
    .findAllTickets({
      status:
        filters.status,
      priority:
        filters.priority,
      categoryId:
        filters.categoryId,
      search:
        normalizeSearch(
          search
        ),
    });
};

/* =========================================
   DETAIL
========================================= */

const getTicketById = async ({
  ticketId,
  userId,
  role,
}) => {
  const parsedTicketId =
    parsePositiveInteger(
      ticketId,
      "ticketId"
    );

  const ticket =
    await ticketRepository
      .findTicketById(
        parsedTicketId
      );

  if (!ticket) {
    throw createServiceError(
      "Ticket not found",
      404
    );
  }

  if (
    role === "EMPLOYEE" &&
    Number(
      ticket.created_by
    ) !== Number(userId)
  ) {
    throw createServiceError(
      "You do not have permission to access this ticket",
      403
    );
  }

  if (
    role === "IT_SUPPORT" &&
    Number(
      ticket.assigned_to
    ) !== Number(userId)
  ) {
    throw createServiceError(
      "You do not have permission to access this ticket",
      403
    );
  }

  return ticket;
};

/* =========================================
   ASSIGN
========================================= */

const assignTicket = async ({
  ticketId,
  assigneeId,
  adminId,
}) => {
  const parsedTicketId =
    parsePositiveInteger(
      ticketId,
      "ticketId"
    );

  const parsedAssigneeId =
    parsePositiveInteger(
      assigneeId,
      "assigneeId"
    );

  const ticket =
    await ticketRepository
      .findTicketById(
        parsedTicketId
      );

  if (!ticket) {
    throw createServiceError(
      "Ticket not found",
      404
    );
  }

  if (
    ticket.status ===
      "CLOSED" ||
    ticket.status ===
      "RESOLVED"
  ) {
    throw createServiceError(
      "Resolved or closed ticket cannot be assigned",
      409
    );
  }

  const assignee =
    await ticketRepository
      .findUserByIdWithRole(
        parsedAssigneeId
      );

  if (!assignee) {
    throw createServiceError(
      "Assignee not found",
      404
    );
  }

  if (
    assignee.role !==
    "IT_SUPPORT"
  ) {
    throw createServiceError(
      "Ticket can only be assigned to IT Support",
      400
    );
  }

  if (!assignee.is_active) {
    throw createServiceError(
      "Assignee account is inactive",
      409
    );
  }

  return await ticketRepository
    .assignTicket({
      ticketId:
        parsedTicketId,
      assigneeId:
        parsedAssigneeId,
      changedBy:
        adminId,
    });
};

/* =========================================
   STATUS
========================================= */

const updateTicketStatus =
  async ({
    ticketId,
    newStatus,
    note,
    userId,
    role,
  }) => {
    const parsedTicketId =
      parsePositiveInteger(
        ticketId,
        "ticketId"
      );

    if (
      !VALID_STATUSES.includes(
        newStatus
      )
    ) {
      throw createServiceError(
        "Invalid ticket status",
        400
      );
    }

    const ticket =
      await ticketRepository
        .findTicketById(
          parsedTicketId
        );

    if (!ticket) {
      throw createServiceError(
        "Ticket not found",
        404
      );
    }

    const oldStatus =
      ticket.status;

    if (
      oldStatus === newStatus
    ) {
      throw createServiceError(
        "Ticket is already in this status",
        409
      );
    }

    if (
      oldStatus === "CLOSED"
    ) {
      throw createServiceError(
        "Closed ticket cannot be updated",
        409
      );
    }

    if (
      role === "IT_SUPPORT"
    ) {
      if (
        Number(
          ticket.assigned_to
        ) !== Number(userId)
      ) {
        throw createServiceError(
          "This ticket is not assigned to you",
          403
        );
      }

      const transitions = {
        ASSIGNED: [
          "IN_PROGRESS",
        ],

        IN_PROGRESS: [
          "WAITING_FOR_USER",
          "RESOLVED",
        ],

        WAITING_FOR_USER: [
          "IN_PROGRESS",
        ],
      };

      const allowed =
        transitions[
          oldStatus
        ] || [];

      if (
        !allowed.includes(
          newStatus
        )
      ) {
        throw createServiceError(
          `Invalid status transition from ${oldStatus} to ${newStatus}`,
          409
        );
      }

      if (
        newStatus ===
          "RESOLVED" &&
        !String(
          note || ""
        ).trim()
      ) {
        throw createServiceError(
          "Resolution note is required",
          400
        );
      }
    } else if (
      role === "EMPLOYEE"
    ) {
      if (
        Number(
          ticket.created_by
        ) !== Number(userId)
      ) {
        throw createServiceError(
          "You do not have permission to update this ticket",
          403
        );
      }

      if (
        oldStatus !==
          "RESOLVED" ||
        newStatus !==
          "CLOSED"
      ) {
        throw createServiceError(
          "Employee can only close a resolved ticket",
          409
        );
      }
    } else {
      throw createServiceError(
        "You do not have permission to update ticket status",
        403
      );
    }

    return await ticketRepository
      .updateTicketStatus({
        ticketId:
          parsedTicketId,
        newStatus,
        changedBy:
          userId,
        note:
          String(
            note || ""
          ).trim() ||
          null,
      });
  };

/* =========================================
   ACCESS HELPER
========================================= */

const validateTicketAccess =
  async ({
    ticketId,
    userId,
    role,
  }) => {
    const ticket =
      await ticketRepository
        .findTicketById(
          ticketId
        );

    if (!ticket) {
      throw createServiceError(
        "Ticket not found",
        404
      );
    }

    if (
      role === "EMPLOYEE" &&
      Number(
        ticket.created_by
      ) !== Number(userId)
    ) {
      throw createServiceError(
        "You do not have permission to access this ticket",
        403
      );
    }

    if (
      role === "IT_SUPPORT" &&
      Number(
        ticket.assigned_to
      ) !== Number(userId)
    ) {
      throw createServiceError(
        "You do not have permission to access this ticket",
        403
      );
    }

    return ticket;
  };

/* =========================================
   COMMENTS
========================================= */

const addComment = async ({
  ticketId,
  userId,
  role,
  content,
}) => {
  const id =
    parsePositiveInteger(
      ticketId,
      "ticketId"
    );

  if (
    !String(
      content || ""
    ).trim()
  ) {
    throw createServiceError(
      "Comment content is required",
      400
    );
  }

  const ticket =
    await validateTicketAccess({
      ticketId: id,
      userId,
      role,
    });

  if (
    ticket.status ===
    "CLOSED"
  ) {
    throw createServiceError(
      "Cannot comment on a closed ticket",
      409
    );
  }

  return await ticketRepository
    .createComment({
      ticketId: id,
      userId,
      content:
        String(
          content
        ).trim(),
    });
};

const getComments = async ({
  ticketId,
  userId,
  role,
}) => {
  const id =
    parsePositiveInteger(
      ticketId,
      "ticketId"
    );

  await validateTicketAccess({
    ticketId: id,
    userId,
    role,
  });

  return await ticketRepository
    .findCommentsByTicketId(
      id
    );
};

/* =========================================
   RATING
========================================= */

const createRating = async ({
  ticketId,
  userId,
  rating,
  comment,
}) => {
  const id =
    parsePositiveInteger(
      ticketId,
      "ticketId"
    );

  const score =
    Number(rating);

  if (
    !Number.isInteger(
      score
    ) ||
    score < 1 ||
    score > 5
  ) {
    throw createServiceError(
      "Rating must be between 1 and 5",
      400
    );
  }

  const ticket =
    await ticketRepository
      .findTicketById(id);

  if (!ticket) {
    throw createServiceError(
      "Ticket not found",
      404
    );
  }

  if (
    Number(
      ticket.created_by
    ) !== Number(userId)
  ) {
    throw createServiceError(
      "Only the ticket creator can submit a rating",
      403
    );
  }

  if (
    ticket.status !==
    "CLOSED"
  ) {
    throw createServiceError(
      "Only closed tickets can be rated",
      409
    );
  }

  const existing =
    await ticketRepository
      .findRatingByTicketId(
        id
      );

  if (existing) {
    throw createServiceError(
      "Ticket has already been rated",
      409
    );
  }

  return await ticketRepository
    .createRating({
      ticketId: id,
      userId,
      rating: score,
      comment:
        String(
          comment || ""
        ).trim() ||
        null,
    });
};

const getRating = async ({
  ticketId,
  userId,
  role,
}) => {
  const id =
    parsePositiveInteger(
      ticketId,
      "ticketId"
    );

  await validateTicketAccess({
    ticketId: id,
    userId,
    role,
  });

  return await ticketRepository
    .findRatingByTicketId(
      id
    );
};

/* =========================================
   ASSET
========================================= */

const updateTicketAsset =
  async ({
    ticketId,
    assetId,
    userId,
    role,
  }) => {
    const id =
      parsePositiveInteger(
        ticketId,
        "ticketId"
      );

    const parsedAssetId =
      parsePositiveInteger(
        assetId,
        "assetId"
      );

    const ticket =
      await validateTicketAccess({
        ticketId: id,
        userId,
        role,
      });

    if (
      ticket.status ===
      "CLOSED"
    ) {
      throw createServiceError(
        "Closed ticket cannot be modified",
        409
      );
    }

    return await ticketRepository
      .linkAssetToTicket({
        ticketId: id,
        assetId:
          parsedAssetId,
      });
  };

/* =========================================
   HISTORY
========================================= */

const getTicketHistory =
  async ({
    ticketId,
    userId,
    role,
  }) => {
    const id =
      parsePositiveInteger(
        ticketId,
        "ticketId"
      );

    await validateTicketAccess({
      ticketId: id,
      userId,
      role,
    });

    return await ticketRepository
      .findTicketHistory(
        id
      );
  };

module.exports = {
  getTicketCategories,

  createTicket,
  getMyTickets,
  getAllTickets,
  getTicketById,

  assignTicket,
  updateTicketStatus,

  addComment,
  getComments,

  createRating,
  getRating,

  updateTicketAsset,
  getTicketHistory,
};