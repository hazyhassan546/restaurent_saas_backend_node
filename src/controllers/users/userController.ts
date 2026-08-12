import type { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const CreateUser = async (req: any, res: any) => {
  try {
    const { name, phone } = req.body;
    const normalizedPhone = phone.trim();

    const existingUser = await prisma.users.findUnique({
      where: { phone: normalizedPhone },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await prisma.users.create({
      data: {
        full_name: name,
        phone: normalizedPhone,
        status: "INACTIVE",
      },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserByPhone = async (req: any, res: any) => {
  try {
    const { name, phone } = req.body;
    const normalizedPhone = phone.trim();

    // Check if the user already exists
    const existingUser = await prisma.users.findUnique({
      where: { phone: normalizedPhone },
    });

    if (existingUser) {
      return existingUser;
    }

    // Create a new user
    const newUser = await prisma.users.create({
      data: {
        full_name: name,
        phone: normalizedPhone,
        status: "INACTIVE",
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

export const getUserById = async (req: Request | any, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserProfile = async (req: Request | any, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    const { full_name, profile_image, gender } = req.body;

    // Check if user exists
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user profile with only provided fields
    const updateData: any = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (profile_image !== undefined) updateData.profile_image = profile_image;
    if (gender !== undefined) updateData.gender = gender;

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: updateData,
    });

    return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
