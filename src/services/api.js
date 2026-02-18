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
      // Ensure we don't double slashes if endpoint starts with /
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
    // FIX: Remove manual rewrite. The Component should pass 'auth/login' or 'orders'
    // If your components pass just 'login', we can keep a small helper, but it's better
    // to fix the call site. For safety, I will keep the check but make it cleaner.
    let url = endpoint;
    if (endpoint === 'login') url = 'auth/login';
    if (endpoint === 'register') url = 'auth/register';

    // Ensure no leading slash issues
    url = url.startsWith('/') ? url.slice(1) : url;

    try {
      const res = await fetch(`${API_URL}/${url}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        // Critical: Parse the backend JSON error to show "Invalid credentials" to user
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
      const res = await fetch(`${API_URL}/${url}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
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