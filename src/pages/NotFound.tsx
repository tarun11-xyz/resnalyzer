import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F9F9F8] font-body text-[#192837] flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center max-w-md"
      >
        <div className="w-24 h-24 bg-white rounded-[24px] flex items-center justify-center mb-8 border border-[#192837]/10" style={{ filter: 'drop-shadow(0 12px 24px rgba(25, 40, 55, 0.05))' }}>
          <FileQuestion className="w-10 h-10 opacity-40 text-[#192837]" />
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold mb-4 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          404
        </h1>
        
        <h2 className="text-xl md:text-2xl font-semibold mb-4 opacity-90" style={{ fontFamily: 'var(--font-heading)' }}>
          Page Not Found
        </h2>
        
        <p className="text-[15px] opacity-70 mb-10 leading-relaxed max-w-xs mx-auto">
          The page you are looking for doesn't exist or has been moved. Let's get you back to safety.
        </p>
        
        <Link 
          to="/" 
          className="btn-chamfer-lg inline-flex items-center gap-2 px-8 py-3.5 bg-[#192837] text-white text-[15px] font-medium hover:bg-[var(--color-accent)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
