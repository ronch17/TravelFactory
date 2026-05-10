import axios from "axios";

export const mainRoute = axios.create({
  baseURL:
    import.meta.env.VITE_BACKEND_URL + import.meta.env.VITE_API_URL ||
    "/api/v1",
});
