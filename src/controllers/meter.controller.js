import { getMeterss,getMeterById } from "../services/meter.service.js";

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

export const getMeter = async (req, res) => {
  try { 

    const { meterId } = req.params;
   console.log(meterId)
    const meter = await getMeterById(meterId);

    res.status(200).json(meter);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch meter details",
    });
  }
};
