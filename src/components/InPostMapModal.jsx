import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';

let easypackLoadPromise = null;

function loadEasypackSDK() {
  if (easypackLoadPromise) return easypackLoadPromise;

  easypackLoadPromise = new Promise((resolve, reject) => {
    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://geowidget.easypack24.net/css/easypack.css';
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement('script');
    script.src = 'https://geowidget.easypack24.net/js/sdk-for-javascript.js';
    script.onload = () => {
      if (window.easyPack) {
        window.easyPack.init({
          defaultLocale: 'pl',
          mapType: 'osm',
          searchType: 'osm',
          points: { types: ['pop', 'parcel_locker'] },
          map: { initialTypes: ['pop', 'parcel_locker'] }
        });
      }
      resolve();
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });

  return easypackLoadPromise;
}

export default function InPostMapModal({ isOpen, onClose, onSelect }) {
  const onSelectRef = useRef(onSelect);
  const onCloseRef = useRef(onClose);
  const [sdkReady, setSdkReady] = useState(!!window.easyPack);

  useEffect(() => {
      onSelectRef.current = onSelect;
      onCloseRef.current = onClose;
  }, [onSelect, onClose]);

  useEffect(() => {
      if (!isOpen) return;

      let cancelled = false;

      loadEasypackSDK().then(() => {
        if (!cancelled) setSdkReady(true);
      }).catch(err => console.error('Failed to load Easypack SDK:', err));

      return () => { cancelled = true; };
  }, [isOpen]);

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

      if (isOpen && sdkReady && window.easyPack) {
          const timeoutId = setTimeout(initMap, 100);
          return () => clearTimeout(timeoutId);
      }
  }, [isOpen, sdkReady]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#1a1715] w-full max-w-4xl h-[80vh] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
        <div className="flex justify-between items-center p-4 border-b border-white/5 bg-[#24201d]">
            <h2 className="text-xl font-bold font-serif text-white">Wybierz Paczkomat</h2>
            <button onClick={onClose} aria-label="Zamknij" className="text-white/50 hover:text-white transition-colors cursor-pointer p-2">
                <FiX size={24} />
            </button>
        </div>
        {!sdkReady ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-3 border-white/20 border-t-(--medium-shade) rounded-full animate-spin"></div>
              <p className="text-white/50 text-sm">Ładowanie mapy paczkomatów...</p>
            </div>
          </div>
        ) : (
          <div 
              className="flex-1 w-full h-full bg-white relative" 
              id="easypack-map"
          ></div>
        )}
      </div>
    </div>,
    document.body
  );
}
