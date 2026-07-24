import { getMeterss } from "../services/meter.service.js";

export const getAllMeters = async (req, res) => {
  try {
    const { page = 1, search = "" } = req.query;

    const meters = await getMeterss({
      page: Number(page),
      search,
    });

    res.status(200).json(meters);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch meters",
    });
  }
};
