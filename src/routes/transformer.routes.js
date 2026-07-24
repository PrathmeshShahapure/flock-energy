import express from "express";
import { getTransformers } from "../controllers/transformer.controller.js";

const router = express.Router();

router.get("/", getTransformers);

export default router;
