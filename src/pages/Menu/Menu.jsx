import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiArrowDropDownLine, RiDraggable } from "react-icons/ri";
import { FiTrash2, FiPlus } from "react-icons/fi";

function Menu({ category, isActive, toggleMenu, index, isEditing, onCategoryChange, onItemChange, onAddItem, onRemoveItem, onRemoveCategory, onReorderItem }) {
  const [insertAtSlot, setInsertAtSlot] = useState(null);
  const dragItemRef = useRef(null);
  const scrollRafRef = useRef(null);

  const containerVariants = {
    collapsed: { opacity: 0, height: 0, transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] } },
    expanded: { opacity: 1, height: "auto", transition: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98], when: "beforeChildren", staggerChildren: 0.03 } }
  };

  const itemVariants = {
    collapsed: { opacity: 0, x: -15 },
    expanded: { opacity: 1, x: 0 }
  };

  const isEven = index % 2 === 0;
  const cardStyle = isEven ? "bg-white/10 border-white/10 hover:bg-white/15" : "bg-white/20 border-white/5 hover:bg-white/25";

  const lastClientYRef = useRef(0);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const EDGE_SIZE = 100;
    const MAX_SPEED = 6;

    const scrollLoop = () => {
      if (!isDraggingRef.current) return;

      const y = lastClientYRef.current;
      if (y < EDGE_SIZE) {
        const intensity = 1 - (y / EDGE_SIZE);
        window.scrollBy(0, -(MAX_SPEED * intensity));
      } else if (y > window.innerHeight - EDGE_SIZE) {
        const intensity = 1 - ((window.innerHeight - y) / EDGE_SIZE);
        window.scrollBy(0, MAX_SPEED * intensity);
      }

      scrollRafRef.current = requestAnimationFrame(scrollLoop);
    };

    const handleGlobalDragOver = (e) => {
      lastClientYRef.current = e.clientY;
    };

    document.addEventListener('dragover', handleGlobalDragOver);

    return () => {
      document.removeEventListener('dragover', handleGlobalDragOver);
      cancelAnimationFrame(scrollRafRef.current);
    };
  }, []);

  const handleDragStart = (e, itemIndex) => {
    dragItemRef.current = itemIndex;
    isDraggingRef.current = true;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
    e.currentTarget.style.opacity = '0.4';
    cancelAnimationFrame(scrollRafRef.current);
    scrollRafRef.current = requestAnimationFrame(function loop() {
      if (!isDraggingRef.current) return;
      const y = lastClientYRef.current;
      const EDGE_SIZE = 100;
      const MAX_SPEED = 6;
      if (y > 0 && y < EDGE_SIZE) {
        window.scrollBy(0, -(MAX_SPEED * (1 - y / EDGE_SIZE)));
      } else if (y > window.innerHeight - EDGE_SIZE) {
        window.scrollBy(0, MAX_SPEED * (1 - (window.innerHeight - y) / EDGE_SIZE));
      }
      scrollRafRef.current = requestAnimationFrame(loop);
    });
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setInsertAtSlot(null);
    dragItemRef.current = null;
    isDraggingRef.current = false;
    cancelAnimationFrame(scrollRafRef.current);
  };

  const handleDragOver = (e, itemIndex) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragItemRef.current === null) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = (e.clientY - rect.top) / rect.height;

    let slot;
    if (relativeY < 0.4) {
      slot = itemIndex;
    } else {
      slot = itemIndex + 1;
    }

    const from = dragItemRef.current;
    if (slot === from || slot === from + 1) {
      setInsertAtSlot(null);
    } else {
      setInsertAtSlot(slot);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const fromIndex = dragItemRef.current;
    if (fromIndex !== null && insertAtSlot !== null) {
      let toIndex = insertAtSlot;
      if (fromIndex < toIndex) toIndex -= 1;
      if (toIndex !== fromIndex) {
        onReorderItem(category.id, fromIndex, toIndex);
      }
    }
    setInsertAtSlot(null);
    dragItemRef.current = null;
    stopAutoScroll();
  };

  const handleDragLeave = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setInsertAtSlot(null);
  };
  const InsertIndicator = () => (
    <div className="h-1 bg-(--medium-shade) rounded-full mx-4 my-1 shadow-[0_0_8px_var(--medium-shade)] transition-all" />
  );

  return (
    <motion.div initial={false} className={`relative w-full lg:w-3/4 max-w-4xl mx-auto my-4 rounded-3xl border backdrop-blur-sm shadow-xl overflow-hidden transition-colors duration-300 ${cardStyle} ${index === 0 ? 'lg:mt-20' : ''}`}>
      
      <div className="relative z-10 flex items-center justify-between p-6 group">
        {isEditing ? (
            <div className="flex-1 flex items-center gap-2 sm:gap-4 mr-2 sm:mr-4">
                <input 
                    type="text" 
                    value={category.title}
                    onChange={(e) => onCategoryChange(category.id, 'title', e.target.value)}
                    className="w-full bg-black/30 border border-white/20 rounded-xl p-2 text-xl lg:text-2xl font-bold tracking-wide text-white focus:border-(--medium-shade) focus:outline-none"
                    placeholder="Nazwa kategorii (np. Letnie Menu)"
                />
                <button onClick={() => onRemoveCategory(category.id)} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-xl transition-colors cursor-pointer shrink-0">
                    <FiTrash2 size={20} />
                </button>
            </div>
        ) : (
            <h1 onClick={() => toggleMenu(category.key)} className="flex-1 cursor-pointer text-xl lg:text-2xl font-bold tracking-wide group-hover:text-(--80-shade) transition-colors duration-300">
                {category.title}
            </h1>
        )}
        
        <motion.div animate={{ rotate: isActive ? 180 : 0 }} transition={{ duration: 0.3 }} onClick={() => !isEditing && toggleMenu(category.key)} className={`text-4xl text-white/70 group-hover:text-white ${!isEditing ? 'cursor-pointer' : ''}`}>
          <RiArrowDropDownLine />
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div key="content" variants={containerVariants} initial="collapsed" animate="expanded" exit="collapsed" className="border-t border-white/5 will-change-transform">
            <ul className="p-4 sm:p-6 space-y-6">
              {category.data.map((item, i) => (
                <div key={item.id || i}>
                  {isEditing && insertAtSlot === i && <InsertIndicator />}

                  <motion.li 
                      variants={itemVariants} 
                      className="relative flex flex-col md:flex-row md:items-baseline justify-between group/item"
                      draggable={isEditing}
                      onDragStart={(e) => isEditing && handleDragStart(e, i)}
                      onDragEnd={isEditing ? handleDragEnd : undefined}
                      onDragOver={(e) => isEditing && handleDragOver(e, i)}
                      onDrop={isEditing ? handleDrop : undefined}
                      onDragLeave={isEditing ? handleDragLeave : undefined}
                  >
                    
                    {isEditing ? (
                        <>
                            {/* --- WIDOK MOBILNY --- */} 
                            <div className="md:hidden w-full flex flex-col gap-4 p-5 bg-black/20 rounded-2xl border border-white/10 relative">
                                
                                <div className="absolute top-4 left-4 cursor-grab active:cursor-grabbing text-white/30 hover:text-white/70 transition-colors touch-none">
                                    <RiDraggable size={22} />
                                </div>

                                <button onClick={() => onRemoveItem(category.id, item.id)} className="absolute top-4 right-4 p-2 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-lg transition-colors cursor-pointer z-10" title="Usuń pozycję">
                                    <FiTrash2 />
                                </button>

                                <div className="flex flex-col gap-1 pr-12 pl-8">
                                    <label className="text-[10px] font-bold opacity-50 uppercase tracking-widest ml-1 text-white cursor-pointer">Nazwa pozycji</label>
                                    <input type="text" value={item.name} onChange={(e) => onItemChange(category.id, item.id, 'name', e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white font-bold focus:border-(--medium-shade) focus:outline-none" placeholder="np. Flat White" />
                                </div>
                                
                                <div className="flex flex-col gap-1 pl-8">
                                    <label className="text-[10px] font-bold opacity-50 uppercase tracking-widest ml-1 text-white cursor-pointer">Składniki</label>
                                    <input type="text" value={item.ingredients} onChange={(e) => onItemChange(category.id, item.id, 'ingredients', e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-white/80 focus:border-(--medium-shade) focus:outline-none italic" placeholder="np. 200ml shot espresso, woda" />
                                </div>

                                <div className="flex flex-col gap-1 pl-8">
                                    <label className="text-[10px] font-bold opacity-50 uppercase tracking-widest ml-1 text-white cursor-pointer">Cena</label>
                                    <div className="relative w-full sm:w-1/2">
                                        <input type="text" value={item.price} onChange={(e) => onItemChange(category.id, item.id, 'price', e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white font-bold focus:border-(--medium-shade) focus:outline-none pr-12" placeholder="np. 15" />
                                    </div>
                                </div>
                            </div>

                            {/* --- WIDOK DESKTOP --- */}
                            <div className="hidden md:flex w-full flex-col gap-2 p-3 bg-black/20 rounded-xl border border-white/10">
                                <div className="flex gap-2 items-center">
                                    <div className="cursor-grab active:cursor-grabbing text-white/30 hover:text-white/70 transition-colors shrink-0 px-1 touch-none select-none">
                                        <RiDraggable size={20} />
                                    </div>
                                    <input type="text" value={item.name} onChange={(e) => onItemChange(category.id, item.id, 'name', e.target.value)} className="flex-1 bg-black/30 border border-white/10 rounded-lg p-2 text-white font-bold focus:border-(--medium-shade) focus:outline-none" placeholder="Nazwa pozycji" />
                                    <div className="relative w-32">
                                        <input type="text" value={item.price} onChange={(e) => onItemChange(category.id, item.id, 'price', e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white font-bold focus:border-(--medium-shade) focus:outline-none pr-10 text-right" placeholder="Cena" />
                                    </div>
                                    <button onClick={() => onRemoveItem(category.id, item.id)} className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-lg transition-colors cursor-pointer shrink-0">
                                        <FiTrash2 />
                                    </button>
                                </div>
                                <div className="pl-8">
                                    <input type="text" value={item.ingredients} onChange={(e) => onItemChange(category.id, item.id, 'ingredients', e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-white/80 focus:border-(--medium-shade) focus:outline-none italic" placeholder="Składniki (opcjonalnie)" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                          <div className="flex flex-col md:w-2/3">
                              <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold group-hover/item:text-(--80-shade) transition-colors">{item.name}</h3>
                              <div className="h-px flex-1 bg-linear-to-r from-white/20 to-transparent my-auto hidden md:block" />
                              </div>
                              <span className="text-sm text-white/50 italic mt-1 font-light tracking-wide">{item.ingredients}</span>
                          </div>
                          <div className="mt-2 md:mt-0 md:text-right">
                              <span className="text-xl font-bold text-(--80-shade) drop-shadow-sm">
                              {item.price} <span className="text-xs font-normal text-white/60">PLN</span>
                              </span>
                          </div>
                        </>
                    )}
                  </motion.li>
                </div>
              ))}
              
              {isEditing && insertAtSlot === category.data.length && <InsertIndicator />}

              {isEditing && (
                  <motion.div variants={itemVariants} className="pt-2">
                      <button onClick={() => onAddItem(category.id)} className="w-full py-3 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-xl text-white/70 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer">
                          <FiPlus /> Dodaj pozycję
                      </button>
                  </motion.div>
              )}

            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Menu;