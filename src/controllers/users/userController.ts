import prisma from "../../utils/prisma";

const isValidPhone = (value: unknown): value is string => {
  return typeof value === "string" && /^\+?[0-9]+$/.test(value.trim());
};

export const CreateUser = async (req: any, res: any) => {
  try {
    const { name, phone } = req.body;

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        message: "Phone must contain only numbers and an optional leading +",
      });
    }

    const normalizedPhone = phone.trim();

    // Check if the user already exists
    const existingUser = await prisma.users.findUnique({
      where: { phone: normalizedPhone },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = await prisma.users.create({
      data: {
        full_name: name,
        phone: normalizedPhone,
      },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
