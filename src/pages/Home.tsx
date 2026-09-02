import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRightCircle, Zap, LockKeyhole, Fingerprint, FileText, Target, Brain, CheckCircle2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
  })
};

const navLinks = ['Analyze', 'Compare', 'Resumes', 'Pricing', 'Tools'];

const Logo = ({ fill = "#192837" }: { fill?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" overflow="visible" viewBox="0 0 256 256">
    <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" fill={fill}/>
  </svg>
);

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div 
      className="w-full bg-[#F9F9F8] overflow-x-hidden" 
      style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
    >
      {/* --- HERO SECTION --- */}
      <section className="relative w-full min-h-screen flex flex-col overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_003132_8b7edcb6-c64d-4a52-a9ca-879942e122ad.mp4"
        />
        
        {/* Progressive Glass Blur Fade into the next section */}
        <div 
          className="absolute bottom-0 left-0 w-full h-48 sm:h-64 pointer-events-none z-0"
          style={{
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            maskImage: 'linear-gradient(to bottom, transparent, black 85%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 85%)',
            background: 'linear-gradient(to bottom, transparent, #F9F9F8)'
          }}
        />
        
        {/* Navbar */}
        <nav className="relative z-10 w-full max-w-[1280px] mx-auto px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
            <Logo />
            <span className="hidden sm:inline-block">Resnalyzer</span>
          </div>
          
          <div className="hidden md:flex items-center gap-5 lg:gap-8">
            {navLinks.map((link) => (
              <a 
                key={link} 
                href="#" 
                className={`text-sm font-medium hover:opacity-70 transition-opacity ${link === 'Tools' ? 'hidden lg:inline-block' : ''}`}
              >
                {link}
              </a>
            ))}
          </div>
          
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="btn-chamfer px-5 py-2.5 text-sm font-medium transition-all hover:brightness-95" style={{ backgroundColor: 'var(--color-login-bg)', color: 'var(--color-text)' }}>
              Sign In
            </button>
            <button onClick={() => navigate('/analyze')} className="btn-chamfer px-5 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110" style={{ backgroundColor: 'var(--color-accent)' }}>
              Start For Free
            </button>
          </div>

          <button className="md:hidden p-2 hover:opacity-70 transition-opacity relative z-10" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </nav>

        {/* Hero Content */}
        <main className="relative z-10 w-full max-w-[1280px] mx-auto px-5 sm:px-8" style={{ paddingTop: 'clamp(40px, 8vw, 72px)' }}>
          <div className="w-full max-w-[560px] md:max-w-[760px] lg:max-w-[900px]">
            <motion.h1
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-6 font-bold"
              style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: 'clamp(1.65rem, 5vw, 3rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                color: '#192837'
              }}
            >
              <span className="inline-flex items-center align-middle relative -top-[2px] mr-2">
                <Zap className="w-6 h-6" color="#192837" />
              </span>
              Know Exactly What’s <br />
              Wrong 
              <span className="inline-flex items-center align-middle relative -top-[2px] mx-2">
                <LockKeyhole className="w-6 h-6" color="#192837" />
              </span>
              With Your Resume
              <span className="inline-flex items-center align-middle relative -top-[2px] ml-2">
                <Fingerprint className="w-6 h-6" color="#192837" />
              </span>
            </motion.h1>
            
            <motion.p
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-10"
              style={{
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                lineHeight: 1.65,
                opacity: 0.8,
                maxWidth: '560px'
              }}
            >
              Analyze, optimize, and tailor your resume with AI-powered<br />
              insights designed to help you stand out.
            </motion.p>
            
            <motion.div
              custom={2}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              variants={fadeUp}
              className="inline-block"
              style={{ filter: 'drop-shadow(0 4px 16px rgba(115,66,226,0.35))' }}
            >
              <button
                onClick={() => navigate('/analyze')}
                className="btn-chamfer-lg inline-flex items-center justify-between text-white font-semibold transition-all hover:brightness-110"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  padding: '17px 24px',
                  fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                  minWidth: '210px',
                  gap: '32px'
                }}
              >
                <span>Analyze My Resume</span>
                <ArrowRightCircle className="w-5 h-5 shrink-0" />
              </button>
            </motion.div>
          </div>
        </main>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="py-24 sm:py-32 px-5 sm:px-8 w-full max-w-[1280px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>How Resnalyzer Works</h2>
          <p className="text-lg opacity-70">Transform your resume from a simple document into a targeted career tool in three simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          {[
            { icon: FileText, title: '1. Upload PDF', desc: 'Securely upload your existing resume in seconds. We support standard PDF formats up to 5MB.' },
            { icon: Brain, title: '2. AI Analysis', desc: 'Our advanced engine scans your resume against thousands of successful industry benchmarks and ATS rules.' },
            { icon: Target, title: '3. Get Hired', desc: 'Receive a detailed, actionable scorecard to optimize your keywords, formatting, and impact.' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-8 bg-white" style={{ 
              clipPath: 'polygon(24px 0, calc(100% - 24px) 0, 100% 24px, 100% calc(100% - 24px), calc(100% - 24px) 100%, 24px 100%, 0 calc(100% - 24px), 0 24px)',
              boxShadow: '0 12px 32px rgba(25, 40, 55, 0.04)'
            }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--color-login-bg)' }}>
                <item.icon className="w-8 h-8 text-[#192837]" />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{item.title}</h3>
              <p className="opacity-70 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FEATURES / BENEFITS SECTION --- */}
      <section className="py-24 sm:py-32 px-5 sm:px-8 w-full bg-[#192837] text-white">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Beat the ATS.<br /> Impress the Humans.
            </h2>
            <p className="text-lg opacity-80 mb-10 leading-relaxed max-w-lg">
              Most resumes never reach a hiring manager. Our system identifies the exact formatting errors, missing keywords, and weak phrasing holding you back.
            </p>
            <ul className="space-y-5">
              {['Keyword Optimization & Matching', 'Formatting & ATS Parsing Checks', 'Impact & Tone Analysis', 'Role-Specific Tailoring Tips'].map((feature, i) => (
                <li key={i} className="flex items-center gap-4 text-lg">
                  <CheckCircle2 className="w-6 h-6 text-[#7342E2]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#7342E2]/20 to-transparent blur-3xl rounded-full" />
            <div className="relative bg-[#CFC8C5] p-8 sm:p-12 text-[#192837]" style={{ 
              clipPath: 'polygon(32px 0, calc(100% - 32px) 0, 100% 32px, 100% calc(100% - 32px), calc(100% - 32px) 100%, 32px 100%, 0 calc(100% - 32px), 0 32px)'
            }}>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  <span className="font-bold text-xl">98</span>
                </div>
                <div>
                  <div className="font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>Resume Score</div>
                  <div className="text-sm opacity-60">Excellent</div>
                </div>
              </div>
              <div className="space-y-4">
                {[85, 92, 100].map((width, i) => (
                  <div key={i} className="w-full bg-white/50 h-3 rounded-full overflow-hidden">
                    <div className="h-full bg-[#7342E2]" style={{ width: `${width}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />

      {/* Mobile Menu Sheet */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              style={{ backgroundColor: 'rgba(25,40,55,0.35)', backdropFilter: 'blur(4px)' }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.45 }}
              className="fixed right-0 top-0 h-[100dvh] z-50 flex flex-col"
              style={{ 
                width: 'min(88vw, 360px)', 
                backgroundColor: '#CFC8C5',
                boxShadow: '-12px 0 48px rgba(25,40,55,0.18)'
              }}
            >
              <div className="flex items-center justify-between p-5 border-b border-[#192837]/10">
                <div className="flex items-center gap-3 font-bold text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
                  <Logo />
                  <span>Resnalyzer</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:opacity-70 transition-opacity">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex flex-col flex-1 p-5 gap-4 overflow-y-auto">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link}
                    href="#"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18 + i * 0.07, ease: "easeOut" }}
                    className="text-lg font-medium hover:opacity-70 transition-opacity py-2 text-[#192837]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link}
                  </motion.a>
                ))}
              </div>
              
              <div className="p-5 flex flex-col gap-3 mt-auto">
                <button onClick={() => navigate('/login')} className="btn-chamfer w-full px-5 py-3 text-sm font-medium transition-all hover:brightness-95" style={{ backgroundColor: 'var(--color-login-bg)', color: 'var(--color-text)' }}>
                  Sign In
                </button>
                <button onClick={() => navigate('/analyze')} className="btn-chamfer w-full px-5 py-3 text-sm font-medium text-white transition-all hover:brightness-110" style={{ backgroundColor: 'var(--color-accent)' }}>
                  Start For Free
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

