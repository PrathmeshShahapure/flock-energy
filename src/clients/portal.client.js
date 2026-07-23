import axios from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import dotenv from "dotenv";
import qs from "qs";
import { parseMeterData } from "../utils/parseMeterData.js";

dotenv.config();
const jar = new CookieJar();

const portalClient = wrapper(
  axios.create({
    baseURL: process.env.URJA_BASE_URL,
    jar,
    withCredentials: true,
    headers: {
      Accept: "application/json",
      Origin: process.env.URJA_BASE_URL,
    },
  }),
);

export const login = async () => {
  console.log("Logging into Urja portal...");

  try {
    await portalClient.post(
      "/login",
      qs.stringify({
        email: process.env.URJA_USERNAME,
        password: process.env.URJA_PASSWORD,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          "x-sveltekit-action": "true",
          Origin: process.env.URJA_BASE_URL,
          Referer: `${process.env.URJA_BASE_URL}/login`,
        },
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400,
      },
    );
    console.log("Authenticated with Urja portal");
  } catch (error) {
    console.error("Failed to authenticate with Urja portal");
    throw error;
  }
};

export const searchMeters = async ({ page = 1, search = "" } = {}) => {
  const response = await portalClient.get("/portal/meters/search", {
    params: {
      q: search,
      page,
    },
  });
  return response.data;
};

export const getMeter = async (meterId) => {
  const response = await portalClient.get(
    `/meters/${meterId}/__data.json?x-sveltekit-invalidated=001`,
  );

  return parseMeterData(response.data);
};

export const getGeo = async (meterId) => {
  const response = await portalClient.get(`/portal/meters/${meterId}/geo`);
  return response.data;
};

export const getEnergy = async (meterId) => {
  const response = await portalClient.get(`/portal/meters/${meterId}/energy`);
  return response.data;
};

export const getTransformers = async ({ page = 1 } = {}) => {
  const response = await portalClient.get("/portal/dts?page=1", {
    params: {
      page,
    },
  });
  return response.data;
};

export default portalClient;
