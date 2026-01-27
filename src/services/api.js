const API_URL = "http://localhost:5000/api";

const getHeaders = () => {
  const token = localStorage.getItem("somnium_token");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const api = {
  get: async (endpoint) => {
    try {
      const res = await fetch(`${API_URL}/${endpoint}`, { 
        headers: getHeaders() 
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${res.status}`);
      }
      
      // Backend returns data directly, no need for .data wrapper usually,
      // but we return the raw JSON here.
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

    try {
      const res = await fetch(`${API_URL}/${url}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Request failed");
      }

      return await res.json();
    } catch (error) {
      console.error("POST request failed:", error);
      throw error;
    }
  },

  put: async (endpoint, id, data) => {
    try {
      const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Update failed");
      return await res.json();
    } catch (error) {
      console.error("PUT request failed:", error);
      throw error;
    }
  },

  delete: async (endpoint, id) => {
    try {
      const res = await fetch(`${API_URL}/${endpoint}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!res.ok) throw new Error("Delete failed");
      return true;
    } catch (error) {
      console.error("DELETE request failed:", error);
      throw error;
    }
  }
};

export default api;