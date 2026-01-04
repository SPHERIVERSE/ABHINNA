const isDev = process.env.NODE_ENV === "development";

export const API_URL = isDev 
  ? "http://localhost:4000" 
  : "/api";