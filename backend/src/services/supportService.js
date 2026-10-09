const supportRepository =
  require("../repositories/supportRepository");

const ALLOWED_PRIORITIES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];

const ALLOWED_STATUSES = [
  "ASSIGNED",
  "IN_PROGRESS",
  "WAITING_FOR_USER",
  "RESOLVED",
];

const getMyQueue = async ({
  userId,
  status,
  priority,
  search,
}) => {
  let normalizedStatus = null;
  let normalizedPriority = null;

  if (status) {
    normalizedStatus =
      status.toUpperCase();

    if (
      !ALLOWED_STATUSES.includes(
        normalizedStatus
      )
    ) {
      throw new Error(
        "INVALID_STATUS_FILTER"
      );
    }
  }

  if (priority) {
    normalizedPriority =
      priority.toUpperCase();

    if (
      !ALLOWED_PRIORITIES.includes(
        normalizedPriority
      )
    ) {
      throw new Error(
        "INVALID_PRIORITY_FILTER"
      );
    }
  }

  return supportRepository.findAssignedTicketsBySupport({
    userId,
    status:
      normalizedStatus,
    priority:
      normalizedPriority,
    search:
      search?.trim() || null,
  });
};

module.exports = {
  getMyQueue,
};