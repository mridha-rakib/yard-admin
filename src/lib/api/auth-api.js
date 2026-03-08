import { apiClient, publicApi } from "./http";

const unwrap = (response) => response.data.data;

export const authApi = {
  login: (payload) => publicApi.post("/auth/login", payload).then(unwrap),
  refresh: (refreshToken) => publicApi.post("/auth/refresh", { refreshToken }).then(unwrap),
  getCurrentUser: () => apiClient.get("/auth/me").then(unwrap),
  logout: () => apiClient.post("/auth/logout").then(unwrap),
  logoutAll: () => apiClient.post("/auth/logout-all").then(unwrap),
};
