import axios from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import dotenv from "dotenv";
import qs from "qs";

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

export default portalClient;
