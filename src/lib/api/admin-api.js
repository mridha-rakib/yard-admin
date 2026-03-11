import { apiClient } from "./http";

const unwrapData = (response) => response.data.data;

const unwrapCollection = (response) => ({
  items: response.data.items || [],
  pagination: response.data.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
});

export const adminApi = {
  listWorkers: (params = {}) =>
    apiClient.get("/admin/workers", { params }).then(unwrapCollection),
  getWorkerFilters: () => apiClient.get("/admin/workers/meta").then(unwrapData),
  getWorkerById: (workerId) => apiClient.get(`/admin/workers/${workerId}`).then(unwrapData),
  approveWorker: (workerId) =>
    apiClient.patch(`/admin/workers/${workerId}/approve`).then(unwrapData),
  rejectWorker: (workerId) =>
    apiClient.patch(`/admin/workers/${workerId}/reject`).then(unwrapData),
  updateWorkerAccountStatus: (workerId, status) =>
    apiClient
      .patch(`/admin/workers/${workerId}/account-status`, { status })
      .then(unwrapData),
  getContentByKey: (key) => apiClient.get(`/content/${key}`).then(unwrapData),
  upsertContent: (key, payload) => apiClient.patch(`/content/${key}`, payload).then(unwrapData),
};
