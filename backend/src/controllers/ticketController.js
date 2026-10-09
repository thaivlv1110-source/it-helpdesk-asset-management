const ticketService = require(
  "../services/ticketService"
);

const handleError = (
  label,
  error,
  res
) => {
  console.error(
    label,
    error
  );

  return res
    .status(
      error.statusCode ||
        500
    )
    .json({
      message:
        error.message ||
        "Internal server error",
    });
};

const getTicketCategories =
  async (
    req,
    res
  ) => {
    try {
      const categories =
        await ticketService
          .getTicketCategories();

      return res
        .status(200)
        .json({
          message:
            "Ticket categories retrieved successfully",
          data:
            categories,
        });
    } catch (error) {
      return handleError(
        "GET CATEGORIES ERROR:",
        error,
        res
      );
    }
  };

const createTicket = async (
  req,
  res
) => {
  try {
    const ticket =
      await ticketService
        .createTicket({
          title:
            req.body.title,
          description:
            req.body
              .description,
          categoryId:
            req.body
              .categoryId,
          priority:
            req.body
              .priority,
          createdBy:
            req.user.userId,
        });

    return res
      .status(201)
      .json({
        message:
          "Ticket created successfully",
        data: ticket,
      });
  } catch (error) {
    return handleError(
      "CREATE TICKET ERROR:",
      error,
      res
    );
  }
};

const getMyTickets = async (
  req,
  res
) => {
  try {
    const tickets =
      await ticketService
        .getMyTickets({
          userId:
            req.user.userId,
          status:
            req.query.status,
          priority:
            req.query.priority,
          categoryId:
            req.query
              .categoryId,
          search:
            req.query.search,
        });

    return res.json({
      message:
        "Tickets retrieved successfully",
      data: tickets,
    });
  } catch (error) {
    return handleError(
      "GET MY TICKETS ERROR:",
      error,
      res
    );
  }
};

const getAllTickets = async (
  req,
  res
) => {
  try {
    const tickets =
      await ticketService
        .getAllTickets({
          status:
            req.query.status,
          priority:
            req.query.priority,
          categoryId:
            req.query
              .categoryId,
          search:
            req.query.search,
        });

    return res.json({
      message:
        "Tickets retrieved successfully",
      data: tickets,
    });
  } catch (error) {
    return handleError(
      "GET ALL TICKETS ERROR:",
      error,
      res
    );
  }
};

const getTicketById =
  async (
    req,
    res
  ) => {
    try {
      const ticket =
        await ticketService
          .getTicketById({
            ticketId:
              req.params.id,
            userId:
              req.user
                .userId,
            role:
              req.user.role,
          });

      return res.json({
        message:
          "Ticket retrieved successfully",
        data: ticket,
      });
    } catch (error) {
      return handleError(
        "GET TICKET ERROR:",
        error,
        res
      );
    }
  };

const assignTicket = async (
  req,
  res
) => {
  try {
    const ticket =
      await ticketService
        .assignTicket({
          ticketId:
            req.params.id,
          assigneeId:
            req.body
              .assigneeId,
          adminId:
            req.user.userId,
        });

    return res.json({
      message:
        "Ticket assigned successfully",
      data: ticket,
    });
  } catch (error) {
    return handleError(
      "ASSIGN TICKET ERROR:",
      error,
      res
    );
  }
};

const updateTicketStatus =
  async (
    req,
    res
  ) => {
    try {
      const ticket =
        await ticketService
          .updateTicketStatus({
            ticketId:
              req.params.id,
            newStatus:
              req.body.status,
            note:
              req.body.note,
            userId:
              req.user
                .userId,
            role:
              req.user.role,
          });

      return res.json({
        message:
          "Ticket status updated successfully",
        data: ticket,
      });
    } catch (error) {
      return handleError(
        "UPDATE STATUS ERROR:",
        error,
        res
      );
    }
  };

const addComment = async (
  req,
  res
) => {
  try {
    const comment =
      await ticketService
        .addComment({
          ticketId:
            req.params.id,
          userId:
            req.user.userId,
          role:
            req.user.role,
          content:
            req.body.content,
        });

    return res
      .status(201)
      .json({
        message:
          "Comment added successfully",
        data: comment,
      });
  } catch (error) {
    return handleError(
      "ADD COMMENT ERROR:",
      error,
      res
    );
  }
};

const getComments = async (
  req,
  res
) => {
  try {
    const comments =
      await ticketService
        .getComments({
          ticketId:
            req.params.id,
          userId:
            req.user.userId,
          role:
            req.user.role,
        });

    return res.json({
      message:
        "Comments retrieved successfully",
      data: comments,
    });
  } catch (error) {
    return handleError(
      "GET COMMENTS ERROR:",
      error,
      res
    );
  }
};

const createRating = async (
  req,
  res
) => {
  try {
    const rating =
      await ticketService
        .createRating({
          ticketId:
            req.params.id,
          userId:
            req.user.userId,
          rating:
            req.body.rating,
          comment:
            req.body.comment,
        });

    return res
      .status(201)
      .json({
        message:
          "Ticket rating created successfully",
        data: rating,
      });
  } catch (error) {
    return handleError(
      "CREATE RATING ERROR:",
      error,
      res
    );
  }
};

const getRating = async (
  req,
  res
) => {
  try {
    const rating =
      await ticketService
        .getRating({
          ticketId:
            req.params.id,
          userId:
            req.user.userId,
          role:
            req.user.role,
        });

    return res.json({
      message:
        "Ticket rating retrieved successfully",
      data:
        rating || null,
    });
  } catch (error) {
    return handleError(
      "GET RATING ERROR:",
      error,
      res
    );
  }
};

const updateTicketAsset =
  async (
    req,
    res
  ) => {
    try {
      const ticket =
        await ticketService
          .updateTicketAsset({
            ticketId:
              req.params.id,
            assetId:
              req.body.assetId,
            userId:
              req.user
                .userId,
            role:
              req.user.role,
          });

      return res.json({
        message:
          "Ticket asset updated successfully",
        data: ticket,
      });
    } catch (error) {
      return handleError(
        "UPDATE ASSET ERROR:",
        error,
        res
      );
    }
  };

const getTicketHistory =
  async (
    req,
    res
  ) => {
    try {
      const history =
        await ticketService
          .getTicketHistory({
            ticketId:
              req.params.id,
            userId:
              req.user
                .userId,
            role:
              req.user.role,
          });

      return res.json({
        message:
          "Ticket history retrieved successfully",
        data: history,
      });
    } catch (error) {
      return handleError(
        "GET HISTORY ERROR:",
        error,
        res
      );
    }
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