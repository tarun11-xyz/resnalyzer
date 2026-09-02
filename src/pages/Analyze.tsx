import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, UploadCloud, File, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { extractTextFromPdf } from '../lib/pdf';

const Logo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" overflow="visible" viewBox="0 0 256 256">
    <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" fill="#192837"/>
  </svg>
);

export default function Analyze() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const clearError = () => setError(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    clearError();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    clearError();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a valid PDF document.");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File is too large. Please upload a PDF under 5MB.");
      return;
    }
    setFile(selectedFile);
    setError(null);
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const handleContinue = async () => {
    if (!file) return;
    setIsExtracting(true);
    setError(null);
    try {
      const extractedText = await extractTextFromPdf(file);
      
      if (!extractedText.trim()) {
         setError("We couldn't extract any text from this PDF. It might be an image-based scan.");
         setIsExtracting(false);
         return;
      }
      
      navigate('/dashboard', { state: { resumeText: extractedText, fileName: file.name } });
    } catch (err) {
      console.error("Error extracting text:", err);
      setError("Failed to read PDF file. The file might be corrupted or password protected.");
    } finally {
      setIsExtracting(false);
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

      {/* Main Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[600px]"
          style={{ 
            filter: 'drop-shadow(0 24px 48px rgba(25, 40, 55, 0.08)) drop-shadow(0 8px 16px rgba(25, 40, 55, 0.04))'
          }}
        >
          <div
            className="w-full bg-white p-6 sm:py-8 sm:px-12"
            style={{ 
              clipPath: 'polygon(24px 0, calc(100% - 24px) 0, 100% 24px, 100% calc(100% - 24px), calc(100% - 24px) 100%, 24px 100%, 0 calc(100% - 24px), 0 24px)'
            }}
          >
            <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Upload Your Resume
            </h1>
            <p className="text-[#192837]/70 text-sm sm:text-base">
              Get an instant AI-powered analysis to optimize your profile.
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-5 overflow-hidden"
              >
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-[13.5px] font-medium leading-relaxed">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div 
            className={`relative border-2 border-dashed rounded-xl p-6 sm:py-6 sm:px-8 flex flex-col items-center justify-center text-center transition-colors
              ${dragActive ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5' : 'border-[#192837]/20 bg-transparent'}
              ${file ? 'border-green-500 bg-green-50' : ''}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              ref={inputRef}
              type="file" 
              accept="application/pdf"
              onChange={handleChange}
              className="hidden" 
            />
            
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <File className="w-10 h-10 text-green-500" />
                <span className="font-medium text-[#192837]">{file.name}</span>
                <span className="text-xs text-[#192837]/60">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                <button 
                  onClick={() => setFile(null)}
                  className="mt-2 text-xs font-semibold text-red-500 hover:opacity-80 transition-opacity"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <>
                <UploadCloud className={`w-10 h-10 mb-3 ${dragActive ? 'text-[var(--color-accent)]' : 'text-[#192837]/40'}`} />
                <p className="font-medium text-base mb-1">Drag & drop your resume here</p>
                <p className="text-[#192837]/60 text-sm mb-4">or</p>
                
                <button 
                  onClick={onButtonClick}
                  className="btn-chamfer px-6 py-2 text-sm font-medium transition-all hover:brightness-95" 
                  style={{ backgroundColor: 'var(--color-login-bg)', color: 'var(--color-text)' }}
                >
                  Browse Files
                </button>
                
                <p className="text-xs text-[#192837]/50 mt-4">PDF • Max 5MB</p>
              </>
            )}
          </div>
          
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleContinue}
              disabled={!file || isExtracting}
              className="btn-chamfer-lg inline-flex items-center justify-center text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
              style={{
                backgroundColor: 'var(--color-accent)',
                padding: '16px 32px',
                fontSize: '1rem',
                minWidth: '200px',
                gap: '12px'
              }}
            >
              {isExtracting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
