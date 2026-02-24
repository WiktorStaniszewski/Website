import React from 'react';
import { createPortal } from 'react-dom';
import { FiAlertTriangle } from "react-icons/fi"; 

export const NotificationPopup = ({ popupMessage, setPopupMessage }) => {
    if (!popupMessage) return null;

    const handleClose = () => {
        if (popupMessage.action) {
            popupMessage.action();
        } else {
            setPopupMessage(null);
        }
    };
      
    return createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in" onClick={handleClose}></div>
            <div className="relative bg-[#24201d] border border-white/10 p-6 rounded-3xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                    <FiAlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{popupMessage.title}</h3>
                <p className="text-white/70 mb-6 leading-relaxed">{popupMessage.desc}</p>
                <button 
                    onClick={handleClose}
                    className="w-full py-3 bg-(--80-shade) hover:bg-(--button-hover-bg) text-[#24201d] rounded-xl font-bold transition-colors cursor-pointer shadow-lg"
                >
                    {popupMessage.buttonText || "Rozumiem"}
                </button>
            </div>
        </div>,
        document.body
    );
};