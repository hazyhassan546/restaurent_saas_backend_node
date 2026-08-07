import prisma from "../../utils/prisma";

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
