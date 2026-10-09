const dashboardRepository =
  require("../repositories/dashboardRepository");

const getDashboard = async () => {
  const [
    tickets,
    assets,
    users,
    ratings,
    recentTickets,
  ] = await Promise.all([
    dashboardRepository.getTicketSummary(),
    dashboardRepository.getAssetSummary(),
    dashboardRepository.getUserSummary(),
    dashboardRepository.getAverageRating(),
    dashboardRepository.getRecentTickets(),
  ]);

  return {
    tickets,
    assets,
    users,
    ratings,
    recentTickets,
  };
};

module.exports = {
  getDashboard,
};