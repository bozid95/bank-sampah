import User from "../models/user.model.js";
import { registerValidate, updateValidate } from "../utils/validator.js";
import bcrypt from "bcrypt";
import xlsx from "xlsx";
import fs from "fs";

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

const uploadUsers = async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json("No file uploaded.");
  }

  const workbook = xlsx.readFile(file.path);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  let uploadedCount = 0;

  try {
    for (const userData of data) {
      // Pastikan password ada di data user dan merupakan string
      if (userData.Password && typeof userData.Password === "string") {
        // Hash password sebelum menyimpan ke database
        const hashedPassword = await bcrypt.hash(userData.Password, 10);
        userData.Password = hashedPassword;
      } else {
        return res
          .status(400)
          .json("Password is required for all users and must be a string.");
      }

      const [user, created] = await User.findOrCreate({
        where: { Email: userData.Email }, // Sesuaikan dengan kolom unik di database Anda
        defaults: userData,
      });

      if (created) {
        uploadedCount++;
      } else {
        console.log(`User with email ${userData.Email} already exists.`);
      }
    }
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error("Failed to delete the file:", err);
      } else {
        console.log("File deleted successfully.");
      }
    });
    res.json({
      message: "File uploaded and processed successfully.",
      uploadedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("An error occurred while processing the file.");
  }
};

export { getAll, getOne, createUser, updateUser, deleteUser, uploadUsers };
