import express from "express";
import { getAllMeters,getMeter,getMeterEnergy,getMeterLocation } from "../controllers/meter.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/meters:
 *   get:
 *     summary: Get all meters
 *     tags:
 *       - Meters
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by meter id or serial number
 *     responses:
 *       200:
 *         description: List of meters
 */
router.get("/", getAllMeters);


/**
 * @swagger
 * /api/meters/{meterId}:
 *   get:
 *     summary: Get meter details
 *     tags:
 *       - Meters
 *     parameters:
 *       - in: path
 *         name: meterId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meter details
 */
router.get("/:meterId", getMeter);


/**
 * @swagger
 * /api/meters/{meterId}/location:
 *   get:
 *     summary: Get meter location
 *     tags:
 *       - Meters
 *     parameters:
 *       - in: path
 *         name: meterId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meter location
 */
router.get("/:meterId/location", getMeterLocation);


/**
 * @swagger
 * /api/meters/{meterId}/energy:
 *   get:
 *     summary: Get meter energy history
 *     tags:
 *       - Meters
 *     parameters:
 *       - in: path
 *         name: meterId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Energy readings
 */
router.get("/:meterId/energy", getMeterEnergy);

export default router;
