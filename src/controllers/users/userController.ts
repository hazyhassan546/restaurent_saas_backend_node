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

export const addUserAddress = async (req: Request | any, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    const { address_type, address_line_1, address_line_2, latitude, longitude, is_default } = req.body;

    // Check if user exists
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If setting as default, unset previous default address
    if (is_default) {
      await prisma.user_addresses.updateMany({
        where: { user_id: userId, is_default: true },
        data: { is_default: false },
      });
    }

    // Create new address
    const newAddress = await prisma.user_addresses.create({
      data: {
        user_id: userId,
        address_type,
        address_line_1,
        address_line_2: address_line_2 || null,
        latitude: latitude ? parseFloat(latitude.toString()) : null,
        longitude: longitude ? parseFloat(longitude.toString()) : null,
        is_default: is_default || false,
      },
    });

    return res.status(201).json({ message: "Address added successfully", address: newAddress });
  } catch (error) {
    console.error("Error adding user address:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserAddress = async (req: Request | any, res: Response) => {
  try {
    const userId = req.user?.id;
    const { addressId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    if (!addressId) {
      return res.status(400).json({ message: "Address ID is required" });
    }

    const { address_type, address_line_1, address_line_2, latitude, longitude, is_default } = req.body;

    // Check if address exists and belongs to the user
    const address = await prisma.user_addresses.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (address.user_id !== userId) {
      return res.status(403).json({ message: "Unauthorized: This address does not belong to you" });
    }

    // If setting as default, unset previous default address
    if (is_default) {
      await prisma.user_addresses.updateMany({
        where: { user_id: userId, is_default: true, NOT: { id: addressId } },
        data: { is_default: false },
      });
    }

    // Update address with only provided fields
    const updateData: any = {};
    if (address_type !== undefined) updateData.address_type = address_type;
    if (address_line_1 !== undefined) updateData.address_line_1 = address_line_1;
    if (address_line_2 !== undefined) updateData.address_line_2 = address_line_2 || null;
    if (latitude !== undefined) updateData.latitude = latitude ? parseFloat(latitude.toString()) : null;
    if (longitude !== undefined) updateData.longitude = longitude ? parseFloat(longitude.toString()) : null;
    if (is_default !== undefined) updateData.is_default = is_default;

    const updatedAddress = await prisma.user_addresses.update({
      where: { id: addressId },
      data: updateData,
    });

    return res.status(200).json({ message: "Address updated successfully", address: updatedAddress });
  } catch (error) {
    console.error("Error updating user address:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUserAddresses = async (req: Request | any, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    const addresses = await prisma.user_addresses.findMany({
      where: { user_id: userId },
      orderBy: {
        is_default: "desc",
      },
    });

    return res.status(200).json({ addresses });
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUserAddress = async (req: Request | any, res: Response) => {
  try {
    const userId = req.user?.id;
    const { addressId } = req.params;
    
    if (!userId) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    if (!addressId) {
      return res.status(400).json({ message: "Address ID is required" });
    }

    // Check if address exists and belongs to the user
    const address = await prisma.user_addresses.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (address.user_id !== userId) {
      return res.status(403).json({ message: "Unauthorized: This address does not belong to you" });
    }

    // Delete the address
    await prisma.user_addresses.delete({
      where: { id: addressId },
    });

    return res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting user address:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
