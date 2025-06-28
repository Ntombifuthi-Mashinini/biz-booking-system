import ContactPage from './pages/ContactPage';

<Route 
  path="/contact" 
  element={
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <ContactPage />
    </motion.div>
  } 
/> 