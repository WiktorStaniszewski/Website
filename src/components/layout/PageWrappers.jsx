import { motion as Motion} from 'framer-motion'
import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Wrapper = ({ children }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return children;
};

const LayoutWrapper = ({ children }) => {
  return (
    <Motion.div
    initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </Motion.div>
  )
}
const PageWrapper = ({ children }) => {
  const fadeVariants = {
    initial: {
      opacity: 0,
      filter: "blur(5px)",
    },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      filter: "blur(5px)", 
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <Motion.div
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full"
    >
      {children}
    </Motion.div>
  );
};

export {
  Wrapper,
  PageWrapper,
  LayoutWrapper
} 