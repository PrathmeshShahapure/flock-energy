import fs from "fs";
import swaggerSpec from "../src/config/swagger.js";

fs.writeFileSync("./openapi.json", JSON.stringify(swaggerSpec, null, 2));

console.log("openapi.json generated");
