import { getAllTransformers } from "../services/transformer.service.js";

export const getTransformers = async (req, res) => {
  try {
    const { page = 1 } = req.query;

    const transformers = await getAllTransformers({
      page: Number(page),
    });

    res.status(200).json(transformers);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch transformers",
    });
  }
};
