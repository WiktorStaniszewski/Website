import { createContext, useContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const initializeAuth = () => {
         try {
            const savedUser = localStorage.getItem("somnium_user");
            const savedToken = localStorage.getItem("somnium_token");

            if (savedUser && savedToken) {
               setUser(JSON.parse(savedUser));
            } else {
               // Cleanup if inconsistent
               localStorage.removeItem("somnium_user");
               localStorage.removeItem("somnium_token");
            }
         } catch (error) {
            console.error("Auth initialization failed:", error);
            localStorage.removeItem("somnium_user");
            localStorage.removeItem("somnium_token");
         } finally {
            setLoading(false);
         }
      };

      initializeAuth();
   }, []);

   const login = useCallback((authResponse) => {
      // Backend returns { token: "...", user: { ... } }
      const { user, token } = authResponse;
      
      if (!user || !token) {
          console.error("Invalid login response structure", authResponse);
          return;
      }

      setUser(user);
      localStorage.setItem("somnium_user", JSON.stringify(user));
      localStorage.setItem("somnium_token", token);
   }, []);

   const logout = useCallback(() => {
      setUser(null);
      localStorage.removeItem("somnium_user");
      localStorage.removeItem("somnium_token");
      window.location.reload();
   }, []);

   const value = {
      user,
      isAuthenticated: !!user,
      login,
      logout,
      loading,
      isAdmin: user?.role === 'admin',
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