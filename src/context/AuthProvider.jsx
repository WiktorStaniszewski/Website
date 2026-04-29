import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { FiAlertTriangle } from "react-icons/fi";
import api from "src/services/api";

export const AuthContext = createContext();

function SessionManager({ logout, setToken }) {
    const [showPrompt, setShowPrompt] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300);
    const lastActivityRef = useRef(Date.now());
    const promptTimerRef = useRef(null);
    const killTimerRef = useRef(null);
    const checkIntervalRef = useRef(null);

    const INACTIVITY_LIMIT = 55 * 60 * 1000;
    const KILL_AFTER_PROMPT = 300; 

    const handleForcedLogout = useCallback((reason) => {
        localStorage.removeItem("somnium_user");
        localStorage.removeItem("somnium_token");
        localStorage.removeItem("somnium_cart");
        localStorage.removeItem("session_start");
        const baseUrl = import.meta.env.BASE_URL || '/';
        const targetUrl = `${baseUrl}login?reason=${reason}`.replace(/([^:])(\/\/+)/g, '$1/');
        window.location.href = targetUrl;
    }, []);

    const resetActivity = useCallback(() => {
        lastActivityRef.current = Date.now();

        if (showPrompt) {
            setShowPrompt(false);
            if (killTimerRef.current) {
                clearInterval(killTimerRef.current);
                killTimerRef.current = null;
            }
        }
    }, [showPrompt]);

    useEffect(() => {
        const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(evt => window.addEventListener(evt, resetActivity, { passive: true }));

        return () => {
            events.forEach(evt => window.removeEventListener(evt, resetActivity));
        };
    }, [resetActivity]);

    useEffect(() => {
        const pingInterval = setInterval(() => {
            api.post('auth/ping').catch((err) => {
                if (err.response && err.response.status === 401) {
                    handleForcedLogout('session_expired');
                }
            });
        }, 5 * 60 * 1000);

        checkIntervalRef.current = setInterval(() => {
            const idleTime = Date.now() - lastActivityRef.current;

            if (idleTime >= INACTIVITY_LIMIT && !showPrompt) {
                setShowPrompt(true);
                setTimeLeft(KILL_AFTER_PROMPT);

                killTimerRef.current = setInterval(() => {
                    setTimeLeft(prev => {
                        if (prev <= 1) {
                            clearInterval(killTimerRef.current);
                            handleForcedLogout('timeout');
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        }, 30 * 1000);

        return () => {
            clearInterval(pingInterval);
            clearInterval(checkIntervalRef.current);
            if (killTimerRef.current) clearInterval(killTimerRef.current);
        };
    }, [handleForcedLogout, showPrompt]);

    const extendSession = async () => {
        try {
            const res = await api.post('auth/extend');
            if (res.token) {
                setToken(res.token);
            }
            lastActivityRef.current = Date.now();
            setShowPrompt(false);
            if (killTimerRef.current) {
                clearInterval(killTimerRef.current);
                killTimerRef.current = null;
            }
        } catch (err) {
            handleForcedLogout('extend_failed');
        }
    };

    if (!showPrompt) return null;

    return createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#24201d] w-full max-w-sm rounded-3xl border border-white/10 shadow-2xl p-6 flex flex-col items-center text-center animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                    <FiAlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Twoja sesja wygasa</h3>
                <p className="text-white/60 mb-2 leading-relaxed text-sm">
                    Nie wykryliśmy aktywności przez dłuższy czas. Zostaniesz automatycznie wylogowany za:
                </p>
                <p className="text-3xl font-mono font-bold text-(--medium-shade) mb-6">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </p>
                <div className="flex gap-3 w-full">
                    <button onClick={() => handleForcedLogout('user_closed')} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors cursor-pointer">
                        Wyloguj mnie
                    </button>
                    <button onClick={extendSession} className="flex-1 py-3 font-bold rounded-xl transition-all cursor-pointer shadow-lg bg-(--medium-shade) hover:brightness-110 text-[#24201d]">
                        Kontynuuj sesję
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

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
      const { user, token } = authResponse;
      
      if (!user || !token) {
          console.error("Invalid login response structure", authResponse);
          return;
      }

      setUser(user);
      localStorage.setItem("somnium_user", JSON.stringify(user));
      localStorage.setItem("somnium_token", token);
      localStorage.setItem("session_start", Date.now().toString()); 
   }, []);

   const logout = useCallback(() => {
      localStorage.removeItem("somnium_user");
      localStorage.removeItem("somnium_token");
      localStorage.removeItem("somnium_cart"); 
      localStorage.removeItem("session_start");
      setUser(null);
   }, []);

   const setToken = useCallback((newToken) => {
      localStorage.setItem("somnium_token", newToken);
   }, []);

   const updateUser = useCallback((updatedUserData) => {
      setUser(updatedUserData);
      localStorage.setItem("somnium_user", JSON.stringify(updatedUserData));
   }, []);

   const value = {
      user,
      isAuthenticated: !!user,
      login,
      logout,
      setToken,
      updateUser,
      loading,
      isAdmin: user?.role === 'super_admin' || user?.role === 'admin',
      isSuperAdmin: user?.role === 'super_admin', 
   };

   return (
      <AuthContext.Provider value={value}>
         {!loading && children}
         {user && <SessionManager logout={logout} setToken={setToken} />}
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