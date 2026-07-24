import dotenv from "dotenv";
import app from "./app.js";
import { login ,searchMeters,getMeter ,getGeo,getEnergy,getTransformers} from "./clients/portal.client.js";

dotenv.config();

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await login();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
      console.error("Failed to start server");
      console.log(error.message)
    process.exit(1);
  }
};

startServer();