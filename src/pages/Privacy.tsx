import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Logo = ({ fill = "#192837" }: { fill?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" overflow="visible" viewBox="0 0 256 256">
    <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" fill={fill}/>
  </svg>
);

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F8] selection:bg-[#7342E2]/20" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
      <nav className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-6 flex items-center justify-between relative z-10 border-b border-[#192837]/10">
        <Link to="/" className="flex items-center gap-3 font-bold text-xl text-[#192837]" style={{ fontFamily: 'var(--font-heading)' }}>
          <Logo />
          <span className="hidden sm:inline-block">Resnalyzer</span>
        </Link>
        <Link to="/" className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </nav>
      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-20 flex-1">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>Privacy Policy</h1>
        <div className="space-y-6 opacity-80 leading-relaxed text-lg">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h2 className="text-2xl font-bold text-[#192837] opacity-100 mt-10 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>1. Information We Collect</h2>
          <p>We collect information you provide directly to us when using Resnalyzer. This includes the PDF resumes you upload for analysis and any account information if you choose to sign up.</p>
          
          <h2 className="text-2xl font-bold text-[#192837] opacity-100 mt-10 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>2. How We Use Your Information</h2>
          <p>We use the collected information solely for the purpose of providing resume analysis and feedback. Your resumes are processed securely and are not used to train AI models without your explicit consent.</p>

          <h2 className="text-2xl font-bold text-[#192837] opacity-100 mt-10 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>3. Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal information and documents from unauthorized access, alteration, or destruction.</p>

          <h2 className="text-2xl font-bold text-[#192837] opacity-100 mt-10 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>4. Third-Party Services</h2>
          <p>We may use third-party AI services to analyze your resume. We ensure that these providers adhere to strict data privacy standards and do not retain your personal data.</p>
          
          <h2 className="text-2xl font-bold text-[#192837] opacity-100 mt-10 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at tarun11.xyz@gmail.com.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
