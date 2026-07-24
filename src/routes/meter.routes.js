import express from "express";
import { getAllMeters } from "../controllers/meter.controller.js";

const router = express.Router();

router.get("/", getAllMeters);

export default router;
