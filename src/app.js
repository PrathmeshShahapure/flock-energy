import express from "express";
import meterRoutes from "./routes/meter.routes.js";
import transformerRoutes from "./routes/transformer.routes.js";

const app = express();
app.use(express.json());

app.use("/api/meters", meterRoutes);
app.use("/api/transformers", transformerRoutes);
app.get("/heath", (req, res) => { 
    res.status(200).json({success:true,message:"Hello there"})
})

export default app;