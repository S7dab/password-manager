import passwordStorageModel from "../model/passwordStorage.js";
import userModel from "../model/user.model.js";
import nodemailer from "nodemailer";

// Admin function to get all users
async function getAllUserDetails(req, res) {
  try {
    const users = await userModel
      .find({ isAdmin: false })
      .select("-password -isAdmin")
      .lean();
    return res.status(200).json({
      status: true,
      message: "user fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      error: error.message,
    });
  }
}

// admin function to delete user
async function adminDeleteUser(req, res) {
  try {
    const userId = req.params.id;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ status: false, message: "user not found" });
    }

    if (user.isAdmin) {
      return res
        .status(403)
        .json({ status: false, message: "Admin accounts cannot be deleted" });
    }

    const deletedUser = await userModel
      .findByIdAndDelete({ _id: userId })
      .select("-password");

    const deletedCredential = await passwordStorageModel.deleteMany({
      userId: userId,
    });

    // using nodeMiller
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_USER, // sender address
      to: user.email, // list of recipients
      subject: "Account Deletion Confirmation - Password Vault", // subject line
      text: "Hello ?", // plain text body
      html: "<b>This is to confirm that your account with Password Vault has been permanently deleted along with all associated credential records stored in our system.If you did not request this action or believe this was done in error, please contact our support team immediately.Thank you, Password Vault Support Team</b>", // HTML body
    });

    return res.status(200).json({
      status: true,
      message: "user and its all credential record deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      error: error.message,
    });
  }
}

// admin function to read user credential
async function getUserAllCredential(req, res) {
  try {
    const userId = req.params.id;

    const userCredential = await passwordStorageModel
      .find({ userId: userId })
      .select("-password")
      .lean();

    if (userCredential.length <= 0) {
      return res
        .status(404)
        .json({ status: false, message: "not found any credential of this user" });
    }

    return res.status(200).json({
      status: true,
      message: "user all credential fetched successfully",
      data: userCredential,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "internal server error",
      error: error.message,
    });
  }
}

export { getAllUserDetails, adminDeleteUser, getUserAllCredential };
