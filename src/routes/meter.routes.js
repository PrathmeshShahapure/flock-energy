import express from "express";
import { getAllMeters,getMeter } from "../controllers/meter.controller.js";

const router = express.Router();

router.get("/", getAllMeters);
router.get("/:meterId", getMeter);
export default router;
