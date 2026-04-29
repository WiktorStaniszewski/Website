import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';

export default function InPostMapModal({ isOpen, onClose, onSelect }) {
  const onSelectRef = useRef(onSelect);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
      onSelectRef.current = onSelect;
      onCloseRef.current = onClose;
  }, [onSelect, onClose]);

  useEffect(() => {
      const initMap = () => {
          const container = document.getElementById('easypack-map');
          if (!container) return;
          
          container.innerHTML = '';
          try {
              window.easyPack.mapWidget('easypack-map', function(point) {
                  if (onSelectRef.current) {
                      onSelectRef.current({
                          name: point.name,
                          address: `${point.address.line1}, ${point.address.line2}`
                      });
                  }
              });
          } catch (e) {
              console.error("Geowidget error:", e);
              window.easyPack.modalMap(function(point, modal) {
                  modal.closeModal();
                  if (onSelectRef.current) {
                      onSelectRef.current({
                          name: point.name,
                          address: `${point.address.line1}, ${point.address.line2}`
                      });
                  }
              }, { width: 500, height: 400 });
              if (onCloseRef.current) onCloseRef.current();
          }
      };

      if (isOpen && window.easyPack) {
          const timeoutId = setTimeout(initMap, 100);
          return () => clearTimeout(timeoutId);
      }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#1a1715] w-full max-w-4xl h-[80vh] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
        <div className="flex justify-between items-center p-4 border-b border-white/5 bg-[#24201d]">
            <h2 className="text-xl font-bold font-serif text-white">Wybierz Paczkomat</h2>
            <button onClick={onClose} className="text-white/50 hover:text-white transition-colors cursor-pointer p-2">
                <FiX size={24} />
            </button>
        </div>
        <div 
            className="flex-1 w-full h-full bg-white relative" 
            id="easypack-map"
        ></div>
      </div>
    </div>,
    document.body
  );
}
