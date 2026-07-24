import { searchMeters, getMeter,getGeo,getEnergy } from "../clients/portal.client.js";

export const getMeterss = async (options) => {
  return await searchMeters(options);
};

export const getMeterById = async (meterId) => {
  return await getMeter(meterId);
};

export const getMeterLocationService = async (meterId) => {
  return await getGeo(meterId);
};

export const getMeterEnergyService = async (meterId) => {
  return await getEnergy(meterId);
};