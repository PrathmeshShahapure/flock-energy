import { searchMeters, getMeter } from "../clients/portal.client.js";

export const getMeterss = async (options) => {
  return await searchMeters(options);
};

export const getMeterById = async (meterId) => {
  return await getMeter(meterId);
};