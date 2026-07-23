import axios from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";
import dotenv from "dotenv";

dotenv.config();
const jar = new CookieJar();

const portalClient = wrapper(
  axios.create({
    baseURL: process.env.URJA_BASE_URL,
    jar,
    withCredentials: true,
  }),
);

export default portalClient;
