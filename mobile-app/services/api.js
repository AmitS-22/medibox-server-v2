import axios from "axios";

export default axios.create({
  baseURL: "https://medibox-server-v2.onrender.com/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});