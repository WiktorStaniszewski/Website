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
  return (
    <Motion.div
    initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </Motion.div>
  )
}

export {
  Wrapper,
  PageWrapper,
  LayoutWrapper
} 