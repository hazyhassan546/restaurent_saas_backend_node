import dotenv from "dotenv";

dotenv.config();

export const env = {
  jwtSecret: process.env.JWT_SECRET || null,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || null,
};
