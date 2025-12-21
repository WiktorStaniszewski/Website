import { createContext, useContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const initializeAuth = () => {
         try {
            const savedUser = localStorage.getItem("somnium_user");
            if (savedUser) {
               const parsedUser = JSON.parse(savedUser);
               // validate JWT normally here if needed
               setUser(parsedUser);
            }
         } catch (error) {
            console.error("Auth initialization failed:", error);
            localStorage.removeItem("somnium_user");
         } finally {
            setLoading(false);
         }
      };

      initializeAuth();
   }, []);

   const login = useCallback((userData) => {
      setUser(userData);
      localStorage.setItem("somnium_user", JSON.stringify(userData));
   }, []);

   const logout = useCallback(() => {
      setUser(null);
      localStorage.removeItem("somnium_user");
   }, []);

   const value = {
      user,
      isAuthenticated: !!user,
      login,
      logout,
      loading
   };

   return (
      <AuthContext.Provider value={value}>
         {!loading && children}
      </AuthContext.Provider>
   );
}

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
   }
   return context;
};