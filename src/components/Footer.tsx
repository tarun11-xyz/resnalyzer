import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ fill = "#192837" }: { fill?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" overflow="visible" viewBox="0 0 256 256">
    <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" fill={fill}/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="py-12 sm:py-16 px-5 sm:px-8 w-full max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-t border-[#192837]/10 mt-12 relative z-10">
      <div className="flex items-center gap-3 font-bold text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
        <Logo />
        <span>Resnalyzer</span>
      </div>
      
      <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
        <Link to="/privacy" className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">Privacy Policy</Link>
        <Link to="/terms" className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">Terms of Service</Link>
        <a href="mailto:tarun11.xyz@gmail.com" className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity">Contact</a>
      </div>
      
      <div className="text-sm opacity-50">
        © {new Date().getFullYear()} Resnalyzer. All rights reserved.
      </div>
    </footer>
  );
}
