import { useState, useRef, useEffect } from "react";
import AuthCard from "pages/Auth/AuthCard";
import { useAuth } from "src/context/AuthProvider";
import { FaUserAstronaut } from "react-icons/fa";

export default function LoginWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [widgetRef]);

  return (
    <div className="relative" ref={widgetRef}>
      {/* 1. The Trigger Icon */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer loginButton headerButton rounded-full hover:bg-white/10 transition-colors"
      >
        {user && user.image ? (
            <img src={user.image} alt="User" className="w-8 h-8 rounded-full border border-white/20" />
        ) : (
            <FaUserAstronaut />
        )}
      </button>

      {/* 2. The Popup Container */}
      {isOpen && (
        <div className="absolute right-0 mt-2 min-w-[350px] bg-(--darker-bg) shadow-[1px_2px_4px_var(--header-footer-bg)] rounded-2xl p-4 duration-200">
          
          <AuthCard onSuccess={() => setIsOpen(false)} />
          
        </div>
      )}
    </div>
  );
}