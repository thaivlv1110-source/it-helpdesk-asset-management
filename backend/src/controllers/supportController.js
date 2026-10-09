const supportService =
  require("../services/supportService");

const getMyQueue = async (req, res) => {
  try {
    const {
      status,
      priority,
      search,
    } = req.query;

    const tickets =
      await supportService.getMyQueue({
        userId:
          req.user.userId,
        status,
        priority,
        search,
      });

    return res.status(200).json({
      message:
        "Support queue retrieved successfully",
      data:
        tickets,
    });
  } catch (error) {
    if (
      error.message ===
      "INVALID_STATUS_FILTER"
    ) {
      return res.status(400).json({
        message:
          "Invalid support ticket status filter",
      });
    }

    if (
      error.message ===
      "INVALID_PRIORITY_FILTER"
    ) {
      return res.status(400).json({
        message:
          "Invalid ticket priority filter",
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
  getMyQueue,
};