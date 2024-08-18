import User from "../models/user.model.js";
import { registerValidate, updateValidate } from "../utils/validator.js";
import bcrypt from "bcrypt";

const getAll = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOne = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (name || email || password) {
    const { error } = registerValidate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const checkEmail = await User.findOne({ where: { email: email } });
    if (checkEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    const result = await User.create({
      Name: name,
      Email: email,
      Password: hashedPassword,
    });
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
const updateUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (password.length < 6 || name.length < 3) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 6 and name must be at least 3 characters long",
    });
  }
  try {
    // Find user by primary key
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Hash the password if provided, otherwise keep the existing password
    let hashedPassword;
    if (!password) {
      hashedPassword = user.password;
    } else {
      hashedPassword = bcrypt.hashSync(password, 10);
    }
    // Update user details
    await user.update({
      Name: name || user.Name,
      Email: email || user.Email,
      Password: hashedPassword || user.Password,
      Role: role || user.Role,
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    await user.destroy();
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
export { getAll, getOne, createUser, updateUser, deleteUser };
