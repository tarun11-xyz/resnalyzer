import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Logo = ({ fill = "#192837" }: { fill?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" overflow="visible" viewBox="0 0 256 256">
    <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" fill={fill}/>
  </svg>
);

export default function Terms() {
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
        <h1 className="text-4xl sm:text-5xl font-bold mb-8" style={{ fontFamily: 'var(--font-heading)' }}>Terms of Service</h1>
        <div className="space-y-6 opacity-80 leading-relaxed text-lg">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          <h2 className="text-2xl font-bold text-[#192837] opacity-100 mt-10 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>1. Acceptance of Terms</h2>
          <p>By accessing or using Resnalyzer, you agree to be bound by these Terms of Service. If you do not agree, please do not use our application.</p>
          
          <h2 className="text-2xl font-bold text-[#192837] opacity-100 mt-10 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>2. Description of Service</h2>
          <p>Resnalyzer provides an AI-powered resume analysis tool designed to offer feedback and recommendations for job seekers. The analysis is automated and should be used as a supplementary guide rather than absolute professional advice.</p>

          <h2 className="text-2xl font-bold text-[#192837] opacity-100 mt-10 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>3. User Responsibilities</h2>
          <p>You are responsible for the documents you upload. Do not upload resumes containing sensitive financial information, government IDs, or the personal data of third parties without their consent.</p>

          <h2 className="text-2xl font-bold text-[#192837] opacity-100 mt-10 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>4. Limitations of Liability</h2>
          <p>Resnalyzer and its creators are not responsible for your job search outcomes. We provide the tool "as is" without any guarantees regarding employment success.</p>
          
          <h2 className="text-2xl font-bold text-[#192837] opacity-100 mt-10 mb-4" style={{ fontFamily: 'var(--font-heading)' }}>5. Modifications to Service</h2>
          <p>We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
