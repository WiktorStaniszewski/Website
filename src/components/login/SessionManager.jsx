import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from 'src/services/api';
import { useAuth } from 'src/context/AuthProvider';
import { FiAlertTriangle } from 'react-icons/fi';
import { createPortal } from 'react-dom';

export default function SessionManager() {
    const { user, logout, setToken } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    const [showPrompt, setShowPrompt] = useState(false);
    const [timeLeft, setTimeLeft] = useState(1800); 
    const [lastActivity, setLastActivity] = useState(Date.now());

    const handleForcedLogout = useCallback((reason) => {
        logout();
        navigate(`/login?reason=${reason}`);
        setShowPrompt(false);
    }, [logout, navigate]);

    useEffect(() => {
        if (!user) return;

        const handleActivity = () => {
            if (!showPrompt) {
                setLastActivity(Date.now());
            }
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);
        window.addEventListener('click', handleActivity);

        const pingInterval = setInterval(() => {
            api.post('auth/ping').catch(err => {
                if (err.response?.status === 401) {
                    handleForcedLogout(err.response?.data?.error || 'session_expired');
                }
            });
        }, 5 * 60 * 1000);

        const inactivityCheckInterval = setInterval(() => {
            const idleTime = Date.now() - lastActivity;
            
            if (idleTime > 60 * 60 * 1000 && !showPrompt) {
                setShowPrompt(true);
                setTimeLeft(1800);
            }
        }, 10000); 

        let killTimer;
        if (showPrompt) {
            killTimer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(killTimer);
                        handleForcedLogout('timeout');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
            window.removeEventListener('click', handleActivity);
            clearInterval(pingInterval);
            clearInterval(inactivityCheckInterval);
            if (killTimer) clearInterval(killTimer);
        };
    }, [user, location.pathname, handleForcedLogout, lastActivity, showPrompt]);

    const extendSession = async () => {
        try {
            const res = await api.post('auth/extend');
            if (res.token) {
                setToken(res.token);
            }
            setLastActivity(Date.now());
            setShowPrompt(false);
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
                    Ze względów bezpieczeństwa zostaniesz automatycznie wylogowany za:
                </p>
                <p className="text-3xl font-mono font-bold text-(--medium-shade) mb-6">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </p>
                <div className="flex gap-3 w-full">
                    <button onClick={() => handleForcedLogout('user_closed')} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors cursor-pointer">
                        Wyloguj mnie
                    </button>
                    <button onClick={extendSession} className="flex-1 py-3 font-bold rounded-xl transition-all cursor-pointer shadow-lg bg-(--medium-shade) hover:brightness-110 text-[#24201d]">
                        Kontynuuj pracę
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}