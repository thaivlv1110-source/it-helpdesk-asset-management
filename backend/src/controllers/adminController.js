const adminService =
  require("../services/adminService");

/* =========================================
   METADATA
========================================= */

const getDepartments =
  async (
    req,
    res
  ) => {
    try {
      const departments =
        await adminService.getDepartments();

      return res
        .status(200)
        .json({
          message:
            "Departments retrieved successfully",

          data:
            departments,
        });
    } catch (error) {
      console.error(
        "GET DEPARTMENTS ERROR:",
        error
      );

      return res
        .status(500)
        .json({
          message:
            "Internal server error",
        });
    }
  };

const getRoles =
  async (
    req,
    res
  ) => {
    try {
      const roles =
        await adminService.getRoles();

      return res
        .status(200)
        .json({
          message:
            "Roles retrieved successfully",

          data:
            roles,
        });
    } catch (error) {
      console.error(
        "GET ROLES ERROR:",
        error
      );

      return res
        .status(500)
        .json({
          message:
            "Internal server error",
        });
    }
  };

/* =========================================
   USERS
========================================= */

const getAllUsers =
  async (
    req,
    res
  ) => {
    try {
      const users =
        await adminService.getAllUsers();

      return res
        .status(200)
        .json({
          message:
            "Users retrieved successfully",

          data:
            users,
        });
    } catch (error) {
      console.error(
        "GET USERS ERROR:",
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
    }
  };

const getUserById =
  async (
    req,
    res
  ) => {
    try {
      const user =
        await adminService.getUserById(
          req.params.id
        );

      return res
        .status(200)
        .json({
          message:
            "User retrieved successfully",

          data:
            user,
        });
    } catch (error) {
      console.error(
        "GET USER ERROR:",
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
    }
  };

/* =========================================
   CREATE
========================================= */

const createUser =
  async (
    req,
    res
  ) => {
    try {
      const user =
        await adminService.createUser(
          req.body
        );

      return res
        .status(201)
        .json({
          message:
            "User created successfully",

          data:
            user,
        });
    } catch (error) {
      console.error(
        "CREATE USER ERROR:",
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
    }
  };

/* =========================================
   STATUS
========================================= */

const updateUserStatus =
  async (
    req,
    res
  ) => {
    try {
      const user =
        await adminService.updateUserStatus({
          adminId:
            req.user.userId,

          targetUserId:
            req.params.id,

          isActive:
            req.body.isActive,
        });

      return res
        .status(200)
        .json({
          message:
            "User status updated successfully",

          data:
            user,
        });
    } catch (error) {
      console.error(
        "UPDATE USER STATUS ERROR:",
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
    }
  };

module.exports = {
  getDepartments,
  getRoles,

  getAllUsers,
  getUserById,

  createUser,
  updateUserStatus,
};