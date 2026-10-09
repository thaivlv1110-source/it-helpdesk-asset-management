const bcrypt =
  require("bcrypt");

const adminRepository =
  require("../repositories/adminRepository");

const VALID_ROLES = [
  "EMPLOYEE",
  "IT_SUPPORT",
  "ADMIN",
];

/* =========================================
   METADATA
========================================= */

const getDepartments =
  async () => {
    return adminRepository.findAllDepartments();
  };

const getRoles =
  async () => {
    return adminRepository.findAllRoles();
  };

/* =========================================
   USERS
========================================= */

const getAllUsers =
  async () => {
    return adminRepository.findAllUsers();
  };

const getUserById =
  async (id) => {
    const parsedId =
      Number(id);

    if (
      !Number.isInteger(
        parsedId
      ) ||
      parsedId <= 0
    ) {
      const error =
        new Error(
          "Invalid user id"
        );

      error.statusCode =
        400;

      throw error;
    }

    const user =
      await adminRepository.findUserById(
        parsedId
      );

    if (!user) {
      const error =
        new Error(
          "User not found"
        );

      error.statusCode =
        404;

      throw error;
    }

    return user;
  };

/* =========================================
   CREATE USER
========================================= */

const createUser =
  async ({
    fullName,
    email,
    password,
    role,
    departmentId,
  }) => {
    if (
      !fullName ||
      !email ||
      !password ||
      !role
    ) {
      const error =
        new Error(
          "Full name, email, password and role are required"
        );

      error.statusCode =
        400;

      throw error;
    }

    const cleanFullName =
      fullName.trim();

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    const cleanRole =
      String(role)
        .trim()
        .toUpperCase();

    if (
      cleanFullName.length <
      2
    ) {
      const error =
        new Error(
          "Full name is invalid"
        );

      error.statusCode =
        400;

      throw error;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        cleanEmail
      )
    ) {
      const error =
        new Error(
          "Invalid email format"
        );

      error.statusCode =
        400;

      throw error;
    }

    if (
      String(password)
        .length < 6
    ) {
      const error =
        new Error(
          "Password must contain at least 6 characters"
        );

      error.statusCode =
        400;

      throw error;
    }

    if (
      !VALID_ROLES.includes(
        cleanRole
      )
    ) {
      const error =
        new Error(
          "Invalid role"
        );

      error.statusCode =
        400;

      throw error;
    }

    const existingUser =
      await adminRepository.findUserByEmail(
        cleanEmail
      );

    if (existingUser) {
      const error =
        new Error(
          "Email already exists"
        );

      error.statusCode =
        409;

      throw error;
    }

    const roleRecord =
      await adminRepository.findRoleByName(
        cleanRole
      );

    if (!roleRecord) {
      const error =
        new Error(
          "Role not found"
        );

      error.statusCode =
        400;

      throw error;
    }

    let validDepartmentId =
      null;

    if (
      departmentId !==
        undefined &&
      departmentId !== null &&
      departmentId !== ""
    ) {
      const parsedDepartmentId =
        Number(
          departmentId
        );

      if (
        !Number.isInteger(
          parsedDepartmentId
        ) ||
        parsedDepartmentId <=
          0
      ) {
        const error =
          new Error(
            "Invalid department"
          );

        error.statusCode =
          400;

        throw error;
      }

      const department =
        await adminRepository.findDepartmentById(
          parsedDepartmentId
        );

      if (!department) {
        const error =
          new Error(
            "Department not found"
          );

        error.statusCode =
          400;

        throw error;
      }

      validDepartmentId =
        department.id;
    }

    const passwordHash =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await adminRepository.createUser({
        fullName:
          cleanFullName,

        email:
          cleanEmail,

        passwordHash,

        roleId:
          roleRecord.id,

        departmentId:
          validDepartmentId,
      });

    return {
      id:
        user.id,

      fullName:
        user.full_name,

      email:
        user.email,

      role:
        roleRecord.name,

      departmentId:
        user.department_id,

      isActive:
        user.is_active,
    };
  };

/* =========================================
   STATUS
========================================= */

const updateUserStatus =
  async ({
    adminId,
    targetUserId,
    isActive,
  }) => {
    if (
      typeof isActive !==
      "boolean"
    ) {
      const error =
        new Error(
          "isActive must be boolean"
        );

      error.statusCode =
        400;

      throw error;
    }

    const parsedTargetUserId =
      Number(
        targetUserId
      );

    if (
      !Number.isInteger(
        parsedTargetUserId
      ) ||
      parsedTargetUserId <=
        0
    ) {
      const error =
        new Error(
          "Invalid user id"
        );

      error.statusCode =
        400;

      throw error;
    }

    if (
      Number(adminId) ===
        parsedTargetUserId &&
      isActive === false
    ) {
      const error =
        new Error(
          "You cannot deactivate your own account"
        );

      error.statusCode =
        409;

      throw error;
    }

    const existingUser =
      await adminRepository.findUserById(
        parsedTargetUserId
      );

    if (!existingUser) {
      const error =
        new Error(
          "User not found"
        );

      error.statusCode =
        404;

      throw error;
    }

    return adminRepository.updateUserStatus(
      parsedTargetUserId,
      isActive
    );
  };

module.exports = {
  getDepartments,
  getRoles,

  getAllUsers,
  getUserById,

  createUser,
  updateUserStatus,
};