import initialProducts from "../../pages/Shop/Sdb/shopData"; 

const DELAY = 600;

const db = {
  read: (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  write: (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

if (!db.read("somnium_products")) {
  db.write("somnium_products", initialProducts);
}
if (!db.read("somnium_orders")) {
  db.write("somnium_orders", [
    { id: 101, customer: "Jan K.", total: 150, status: "completed", date: "2024-01-08" },
    { id: 102, customer: "Anna N.", total: 45, status: "new", date: "2024-01-08" },
    { id: 103, customer: "Piotr W.", total: 320, status: "processing", date: "2024-01-07" },
  ]);
}
//get 
export const mockDatabase = {
  get: async (collection) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = db.read(`somnium_${collection}`) || [];
        resolve({ status: 200, data });
      }, DELAY);
    });
  },

//post
  post: async (collection, payload) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = db.read(`somnium_${collection}`) || [];
        const newItem = { ...payload, id: Date.now() }; 
        db.write(`somnium_${collection}`, [...items, newItem]);
        resolve({ status: 201, data: newItem });
      }, DELAY);
    });
  },

//put
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
  
//delete
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