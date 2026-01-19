import initialProducts from "pages/Shop/data/products"; 

const DELAY = 600;

// Initialize "DB" with local storage
const db = {
  read: (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  write: (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// Seed Data
if (!db.read("somnium_products")) {
  db.write("somnium_products", initialProducts);
}
// Seed Orders
if (!db.read("somnium_orders")) {
  db.write("somnium_orders", [
    { id: 101, customer: "Jan K.", total: 150, status: "completed", date: "2024-01-08" },
  ]);
}

export const mockDatabase = {
  get: async (collection) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = db.read(`somnium_${collection}`) || [];
        resolve({ status: 200, data });
      }, DELAY);
    });
  },

  post: async (collection, payload) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // --- Special Handler for Login ---
        if (collection === "login") {
            // Simulate a check (Accept any user/pass for demo, or add specific logic)
            if (payload.username && payload.password) {
                const fakeUser = {
                    id: 999,
                    username: payload.username,
                    firstName: payload.username, // Fallback for demo
                    email: `${payload.username}@example.com`,
                    image: "https://robohash.org/" + payload.username,
                    token: "mock-jwt-token-123"
                };
                resolve({ status: 200, data: fakeUser });
            } else {
                reject({ message: "Invalid credentials" });
            }
            return;
        }

        // --- Standard Post ---
        const items = db.read(`somnium_${collection}`) || [];
        const newItem = { ...payload, id: payload.id || Date.now() }; 
        db.write(`somnium_${collection}`, [...items, newItem]);
        resolve({ status: 201, data: newItem });
      }, DELAY);
    });
  },

  put: async (collection, id, payload) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = db.read(`somnium_${collection}`) || [];
        const updatedItems = items.map(item => 
          (item.id === id || item.name === id) ? { ...item, ...payload } : item
        );
        db.write(`somnium_${collection}`, updatedItems);
        resolve({ status: 200, data: payload });
      }, DELAY);
    });
  },
  
  delete: async (collection, id) => {
     return new Promise((resolve) => {
      setTimeout(() => {
        const items = db.read(`somnium_${collection}`) || [];
        const filtered = items.filter(item => item.id !== id && item.name !== id);
        db.write(`somnium_${collection}`, filtered);
        resolve({ status: 200, success: true });
      }, DELAY);
    }); 
  }
};