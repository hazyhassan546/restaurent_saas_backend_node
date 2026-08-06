"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("../generated/prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error("DATABASE_URL is not defined in environment variables");
}
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: databaseUrl,
});
const prisma = new client_1.PrismaClient({
    adapter,
});
async function connectDatabase() {
    try {
        await prisma.$connect();
        console.log("✅ Database connected successfully");
    }
    catch (error) {
        console.error("❌ Database connection failed:");
        if (error instanceof Error) {
            console.error(error.message);
        }
        else {
            console.error(error);
        }
        process.exit(1);
    }
}
connectDatabase();
exports.default = prisma;
//# sourceMappingURL=prisma.js.map