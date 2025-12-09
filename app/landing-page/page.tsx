"use client"; 
import { motion } from "framer-motion";

export default function page() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="p-4 bg-blue-500 text-white rounded"
    >
      Hello Framer Motion!
    </motion.div>
  );
}
