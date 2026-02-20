const API_URL = "http://localhost:5000/api";

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem("somnium_token");
  const headers = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const api = {
  get: async (endpoint) => {
    try {
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
      const res = await fetch(`${API_URL}/${cleanEndpoint}`, { 
        headers: getHeaders() 
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${res.status}`);
      }
      
      return await res.json();
    } catch (error) {
      console.error("GET request failed:", error);
      throw error;
    }
  },

  post: async (endpoint, data) => {
    let url = endpoint;
    if (endpoint === 'login') url = 'auth/login';
    if (endpoint === 'register') url = 'auth/register';

    url = url.startsWith('/') ? url.slice(1) : url;

    const isFormData = data instanceof FormData;

    try {
      const res = await fetch(`${API_URL}/${url}`, {
        method: "POST",
        headers: getHeaders(isFormData),
        body: isFormData ? data : JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${res.status}`);
      }

      return await res.json();
    } catch (error) {
      console.error("POST request failed:", error);
      throw error;
    }
  },

  put: async (endpoint, id, data) => {
    try {
      const url = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
      const fetchUrl = id ? `${API_URL}/${url}/${id}` : `${API_URL}/${url}`;
      
      const isFormData = data instanceof FormData;

      const res = await fetch(fetchUrl, {
        method: "PUT",
        headers: getHeaders(isFormData),
        body: isFormData ? data : JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Update failed");
      }
      return await res.json();
    } catch (error) {
      console.error("PUT request failed:", error);
      throw error;
    }
  },

  delete: async (endpoint, id) => {
    try {
      const url = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
      const res = await fetch(`${API_URL}/${url}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Delete failed");
      }
      return true;
    } catch (error) {
      console.error("DELETE request failed:", error);
      throw error;
    }
  }
};

export default api;