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

const unwrapCollectionWithSummary = (response) => ({
  items: response.data.items || [],
  pagination: response.data.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
  summary: response.data.summary || {},
});

export const adminApi = {
  getDashboardStats: () => apiClient.get("/admin/dashboard").then(unwrapData),
  listWorkers: (params = {}) =>
    apiClient.get("/admin/workers", { params }).then(unwrapCollection),
  getWorkerFilters: () => apiClient.get("/admin/workers/meta").then(unwrapData),
  getWorkerById: (workerId) => apiClient.get(`/admin/workers/${workerId}`).then(unwrapData),
  approveWorker: (workerId) =>
    apiClient.patch(`/admin/workers/${workerId}/approve`).then(unwrapData),
  rejectWorker: (workerId) =>
    apiClient.patch(`/admin/workers/${workerId}/reject`).then(unwrapData),
  deleteWorker: (workerId) => apiClient.delete(`/admin/workers/${workerId}`).then(unwrapData),
  updateWorkerAccountStatus: (workerId, status) =>
    apiClient
      .patch(`/admin/workers/${workerId}/account-status`, { status })
      .then(unwrapData),
  listCustomers: (params = {}) =>
    apiClient.get("/admin/customers", { params }).then(unwrapCollection),
  getCustomerById: (customerId) => apiClient.get(`/admin/customers/${customerId}`).then(unwrapData),
  listPayments: (params = {}) =>
    apiClient.get("/admin/payments", { params }).then(unwrapCollectionWithSummary),
  listBookings: (params = {}) =>
    apiClient.get("/admin/bookings", { params }).then(unwrapCollection),
  getBookingById: (jobId) => apiClient.get(`/admin/bookings/${jobId}`).then(unwrapData),
  updateBookingStatus: (bookingId, status) =>
    apiClient.patch(`/admin/bookings/${bookingId}/status`, { status }).then(unwrapData),
  getSettings: () => apiClient.get("/admin/settings").then(unwrapData),
  updateSettings: (payload) => apiClient.patch("/admin/settings", payload).then(unwrapData),
  updateCurrentProfile: (payload) => apiClient.patch("/users/profile", payload).then(unwrapData),
  changeProfilePassword: (payload) =>
    apiClient.patch("/users/profile/password", payload).then(unwrapData),
  listSupportConversations: (params = {}) =>
    apiClient.get("/support/conversations", { params }).then(unwrapCollection),
  getSupportConversation: (conversationId) =>
    apiClient.get(`/support/conversations/${conversationId}`).then(unwrapData),
  replyToSupportConversation: (conversationId, payload) =>
    apiClient.post(`/support/conversations/${conversationId}/messages`, payload).then(unwrapData),
  updateSupportConversationStatus: (conversationId, status) =>
    apiClient.patch(`/support/conversations/${conversationId}/status`, { status }).then(unwrapData),
  getContentByKey: (key) => apiClient.get(`/content/${key}`).then(unwrapData),
  upsertContent: (key, payload) => apiClient.patch(`/content/${key}`, payload).then(unwrapData),
};
