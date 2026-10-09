const dashboardService =
  require("../services/dashboardService");

const getDashboard = async (req, res) => {
  try {
    const data =
      await dashboardService.getDashboard();

    return res.status(200).json({
      message:
        "Dashboard retrieved successfully",
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Internal server error",
    });
  }
};

module.exports = {
  getDashboard,
};