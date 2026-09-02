import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithGoogle } from '../lib/firebase';
import { ArrowLeft, User, Briefcase } from 'lucide-react';

const Logo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" overflow="visible" viewBox="0 0 256 256">
    <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" fill="#192837"/>
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin = async (role: 'candidate' | 'recruiter') => {
    try {
      setLoading(role);
      setError(null);
      await signInWithGoogle(role);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Sign-in popup was blocked. Please allow popups and try again.');
      } else {
        setError(err.message || 'Failed to sign in. Please try again.');
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div 
      className="relative w-full min-h-screen flex flex-col overflow-hidden" 
      style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)', backgroundColor: '#F9F9F8' }}
    >
      {/* Navbar Minimal */}
      <nav className="relative z-10 w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 font-bold text-xl hover:opacity-70 transition-opacity" style={{ fontFamily: 'var(--font-heading)' }}>
          <Logo />
          <span className="hidden sm:inline-block">Resnalyzer</span>
        </Link>
        <Link to="/" className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </nav>

      {/* Main Login Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[480px]"
          style={{ 
            filter: 'drop-shadow(0 24px 48px rgba(25, 40, 55, 0.08)) drop-shadow(0 8px 16px rgba(25, 40, 55, 0.04))'
          }}
        >
          <div
            className="w-full bg-white p-8 sm:p-12"
            style={{ 
              clipPath: 'polygon(24px 0, calc(100% - 24px) 0, 100% 24px, 100% calc(100% - 24px), calc(100% - 24px) 100%, 24px 100%, 0 calc(100% - 24px), 0 24px)'
            }}
          >
            <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              Welcome Back
            </h1>
            <p className="text-[#192837]/70 text-sm sm:text-base">
              Securely log in to the recruiter portal.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm border border-red-100 font-medium">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-6">
            {/* Recruiter Login */}
            <div className="relative group w-full cursor-not-allowed">
              <button
                disabled
                className="w-full flex flex-col items-center justify-center gap-4 p-8 border-2 border-transparent transition-all opacity-80"
                style={{
                  backgroundColor: '#192837',
                  color: 'white',
                  clipPath: 'polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)',
                }}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white shadow-sm">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-lg mb-1" style={{ fontFamily: 'var(--font-heading)' }}>Recruiter</div>
                  <div className="text-xs text-white/60">Find Top Talent</div>
                </div>
                <div 
                  className="mt-2 text-xs font-semibold px-4 py-1.5 rounded-full w-full max-w-[200px] transition-all text-[#192837]"
                  style={{ backgroundColor: 'var(--color-login-bg)' }}
                >
                  Sign in with Google
                </div>
              </button>
              
              {/* Coming Soon Overlay */}
              <div 
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  backgroundColor: 'rgba(25, 40, 55, 0.95)',
                  clipPath: 'polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)',
                }}
              >
                <div 
                  className="btn-chamfer px-5 py-2.5 text-sm font-medium text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300 shadow-2xl"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                >
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
