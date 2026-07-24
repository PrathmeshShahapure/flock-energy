import express from "express";
import { getAllMeters,getMeter,getMeterEnergy,getMeterLocation } from "../controllers/meter.controller.js";

const router = express.Router();

router.get("/", getAllMeters);
router.get("/:meterId", getMeter);
router.get("/:meterId/location", getMeterLocation);
router.get("/:meterId/energy", getMeterEnergy);

export default router;
