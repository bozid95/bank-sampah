import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { registerValidate, loginValidate } from "../utils/validator.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const { error } = registerValidate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
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

const login = async (req, res) => {
  const { email, password } = req.body;
  const { error } = loginValidate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const validPassword = await bcrypt.compare(password, user.Password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign(
      { id: user.UserID, name: user.Name, role: user.Role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const me = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user,
      name: req.user.Name,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
export { register, login, logout, me };
