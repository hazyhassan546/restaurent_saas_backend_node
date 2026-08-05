import app from "./app";
import { logger } from "./utils/logger";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  logger.info({ port: PORT }, "Server running");
});
