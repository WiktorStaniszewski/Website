import { mockDatabase } from "./mock/mockDatabase";

const USE_MOCK = true; //if the true backend is not ready yet

const api = {
  get: (endpoint) => {
    if (USE_MOCK) return mockDatabase.get(endpoint);
    // return fetch(`/api/${endpoint}`).then(res => res.json());
  },
  post: (endpoint, data) => {
    if (USE_MOCK) return mockDatabase.post(endpoint, data);
    // return fetch(`/api/${endpoint}`, { method: 'POST'... });
  },
  put: (endpoint, id, data) => {
    if (USE_MOCK) return mockDatabase.put(endpoint, id, data);
  },
  delete: (endpoint, id) => {
    if (USE_MOCK) return mockDatabase.delete(endpoint, id);
  }
};

export default api;