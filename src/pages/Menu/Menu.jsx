import { motion, AnimatePresence } from "framer-motion";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useViewport } from "hooks/useViewport.jsx";

function Menu({ displayedTitle, productArray, isActive, toggleMenu, classTitle, index }) {
  const { isMobile } = useViewport();

  // --- Animation Variants ---
  const containerVariants = {
    collapsed: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] } 
    },
    expanded: { 
      opacity: 1, 
      height: "auto",
      transition: { 
        duration: 0.4, 
        ease: [0.04, 0.62, 0.23, 0.98],
        when: "beforeChildren", // Open first, then show items
        staggerChildren: 0.05   // Stagger items by 50ms
      } 
    }
  };

  const itemVariants = {
    collapsed: { opacity: 0, x: -20 },
    expanded: { opacity: 1, x: 0 }
  };

  // Alternate styles based on index (Simulating your old CSS nth-child logic but better)
  const isEven = index % 2 === 0;
  const cardStyle = isEven 
    ? "bg-white/1 border-white/10 hover:bg-white/5" 
    : "bg-black/20 border-white/5 hover:bg-black/30";

  return (
    <motion.div 
      initial={false}
      className={`
        relative w-full lg:w-3/4 max-w-4xl mx-auto my-4 
        rounded-3xl border backdrop-blur-md shadow-xl overflow-hidden
        transition-colors duration-300
        ${cardStyle}
      `}
    >
      {/* Header / Trigger */}
      <div 
        onClick={() => toggleMenu(classTitle)}
        className="relative z-10 flex items-center justify-between p-6 cursor-pointer group"
      >
        <h1 className="text-xl lg:text-2xl font-bold tracking-wide group-hover:text-(--80-shade) transition-colors duration-300">
          {displayedTitle}
        </h1>
        
        {/* Animated Arrow */}
        <motion.div
          animate={{ rotate: isActive ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-4xl text-white/70 group-hover:text-white"
        >
          <RiArrowDropDownLine />
        </motion.div>
      </div>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            key="content"
            variants={containerVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="border-t border-white/5"
          >
            <ul className="p-6 space-y-6">
              {productArray.map((item, i) => (
                <motion.li 
                  key={i} 
                  variants={itemVariants}
                  className="relative flex flex-col md:flex-row md:items-baseline justify-between group/item"
                >
                  {/* Left Side: Name & Ingredients */}
                  <div className="flex flex-col md:w-2/3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold group-hover/item:text-(--80-shade) transition-colors">
                        {item.name}
                      </h3>
                      {/* Decorative Line */}
                      <div className="h-px flex-1 bg-linear-to-r from-white/20 to-transparent my-auto hidden md:block" />
                    </div>
                    <span className="text-sm text-white/50 italic mt-1 font-light tracking-wide">
                      {item.ingredients}
                    </span>
                  </div>

                  {/* Right Side: Price */}
                  <div className="mt-2 md:mt-0 md:text-right">
                    <span className="text-xl font-bold text-(--80-shade) drop-shadow-sm">
                      {item.price} <span className="text-xs font-normal text-white/60">PLN</span>
                    </span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Menu;