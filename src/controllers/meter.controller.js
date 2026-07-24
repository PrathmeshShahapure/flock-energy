import {
  getMeterss,
  getMeterById,
  getMeterLocationService,
  getMeterEnergyService,
} from "../services/meter.service.js";

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
    console.log(meterId);
    const meter = await getMeterById(meterId);

    res.status(200).json(meter);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch meter details",
    });
  }
};

export const getMeterLocation = async (req, res) => {
  try {
    const { meterId } = req.params;

    const location = await getMeterLocationService(meterId);

    res.status(200).json(location);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch meter location",
    });
  }
};

export const getMeterEnergy = async (req, res) => {
  try {
    const { meterId } = req.params;

    const energy = await getMeterEnergyService(meterId);

    res.status(200).json(energy);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch meter energy",
    });
  }
};

