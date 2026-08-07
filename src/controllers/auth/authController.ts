import {
  generateAuthToken,
  generateRefreshToken,
} from "../../services/jwtService";
import { sendOTP, validateOTP } from "../../services/otpService";
import { isValidPhone } from "../../utils/helperFunctions";
import prisma from "../../utils/prisma";
import { getUserByPhone } from "../users/userController";
import jwt from "jsonwebtoken";

export const initializeUserLogin = async (req: any, res: any) => {
  try {
    // get the phone number from the request body
    // Validate the phone number format
    const { phone } = req.body;

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        message: "Phone must contain only numbers and an optional leading +",
      });
    }

    const normalizedPhone = phone.trim();
    // Check if the user exists in the database
    const existingUser = await getUserByPhone(req, res);
    const userId = existingUser?.id || "";
    await sendOTP(userId, normalizedPhone);

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOTP = async (req: any, res: any) => {
  try {
    const { phone, otp } = req.body;
    const result = await validateOTP(phone, otp);
    if (!result.success) {
      return res.status(400).json(result);
    }

    if (!result.user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const token = generateAuthToken(result.user);
    const refresh_token = generateRefreshToken(result.user);

    res.send({
      message: "Login successful",
      user: {
        id: result.user.id,
        name: result.user?.full_name,
        phone: result.user.phone,
      },
      access_token: token,
      refresh_token: refresh_token,
    });

    return res.status(200).json({
      message: "OTP verified successfully",
      user: result.user,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshToken = async (req: any, res: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const old_token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(
      old_token,
      process.env.JWT_REFRESH_SECRET as string,
    );
    const userId = decoded.id;

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Invalid or expired token");
    }

    // Generate JWT
    const token = generateAuthToken(user);
    const refresh_token = generateRefreshToken(user);

    res.send({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.full_name,
        phone: user.phone,
      },
      access_token: token,
      refresh_token: refresh_token,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
