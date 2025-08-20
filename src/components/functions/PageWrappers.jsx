import { motion as Motion} from 'framer-motion'

function LayoutWrapper({ children }) {
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
function PageWrapper({ children }) {
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
    PageWrapper,
    LayoutWrapper
} 