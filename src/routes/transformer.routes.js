import express from "express";
import { getTransformers } from "../controllers/transformer.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/transformers:
 *   get:
 *     summary: Get all transformers
 *     tags:
 *       - Transformers
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of transformers
 */
router.get("/", getTransformers);

export default router;
