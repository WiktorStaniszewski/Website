import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { FiAlertTriangle } from "react-icons/fi";
import api from "src/services/api";

export const AuthContext = createContext();

function SessionManager({ logout, setToken }) {
    const [showPrompt, setShowPrompt] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300);
    const killTimerRef = useRef(null);
    const checkIntervalRef = useRef(null);

    const isRemembered = localStorage.getItem("somnium_remember_me") === "true";
    const TOTAL_SESSION_TIME = isRemembered ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
    const INACTIVITY_LIMIT = TOTAL_SESSION_TIME - (5 * 60 * 1000); 
    const KILL_AFTER_PROMPT = 300;

    useEffect(() => {
        const pingInterval = setInterval(() => {
            api.post('auth/ping').catch((err) => {
                if (err.response && err.response.status === 401) {
                    logout('session_expired');
                }
            });
        }, 5 * 60 * 1000);

        const checkIntegrity = () => {
            const token = localStorage.getItem("somnium_token");
            const userData = localStorage.getItem("somnium_user");
                
            if (!token || !userData) {
                logout('session_invalidated');
            }
        };

        checkIntervalRef.current = setInterval(() => {
            checkIntegrity();

            const sessionStart = parseInt(localStorage.getItem("session_start") || Date.now());
            const elapsed = Date.now() - sessionStart;

            if (elapsed >= INACTIVITY_LIMIT && !showPrompt) {
                setShowPrompt(true);
                setTimeLeft(KILL_AFTER_PROMPT);
            }
        }, 5000);

        // Catch storage changes from other tabs
        const handleStorageChange = (e) => {
            if (e.key === "somnium_token" || e.key === "somnium_user") {
                if (!e.newValue) {
                    logout('session_invalidated');
                }
            }
        };
        window.addEventListener('storage', handleStorageChange);

        // Check on window focus
        const handleFocus = () => checkIntegrity();
        window.addEventListener('focus', handleFocus);

        return () => {
            clearInterval(pingInterval);
            if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('focus', handleFocus);
        };
    }, [logout, showPrompt, INACTIVITY_LIMIT]);

    useEffect(() => {
        if (!showPrompt) {
            if (killTimerRef.current) {
                clearInterval(killTimerRef.current);
                killTimerRef.current = null;
            }
            return;
        }

        killTimerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(killTimerRef.current);
                    killTimerRef.current = null;
                    logout('timeout');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (killTimerRef.current) {
                clearInterval(killTimerRef.current);
                killTimerRef.current = null;
            }
        };
    }, [showPrompt, logout]);

    const extendSession = async () => {
        try {
            const res = await api.post('auth/extend');
            if (res.token) {
                setToken(res.token);
            }
            localStorage.setItem("session_start", Date.now().toString());
            setShowPrompt(false);
            if (killTimerRef.current) {
                clearInterval(killTimerRef.current);
                killTimerRef.current = null;
            }
        } catch (err) {
            logout('extend_failed');
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
                    Ze względów bezpieczeństwa zostaniesz automatycznie wylogowany za:
                </p>
                <p className="text-3xl font-mono font-bold text-(--medium-shade) mb-6">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </p>
                <div className="flex gap-3 w-full">
                    <button onClick={() => logout('user_closed')} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors cursor-pointer">
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
        localStorage.setItem("somnium_remember_me", authResponse.rememberMe ? "true" : "false");
        localStorage.setItem("session_start", Date.now().toString());
    }, []);

    const logout = useCallback(async (reason = null) => {
        try {
            await api.post('auth/logout', {}).catch(() => {});
        } catch (_) {}
        
        localStorage.removeItem("somnium_user");
        localStorage.removeItem("somnium_token");
        localStorage.removeItem("somnium_cart");
        localStorage.removeItem("session_start");
        localStorage.removeItem("somnium_session_id");
        localStorage.removeItem("somnium_checkout_expires");
        
        setUser(null);
        
        const baseUrl = window.location.origin + window.location.pathname;
        const targetUrl = reason ? `${baseUrl}#/login?reason=${reason}` : `${baseUrl}#/login`;
        
        window.location.href = targetUrl;
        window.location.reload();
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