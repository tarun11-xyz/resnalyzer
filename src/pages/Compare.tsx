import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2, Trophy, Minus, Check } from 'lucide-react';

const Logo = ({ fill = "#192837", width = "32", height = "32", className = "" }: { fill?: string, width?: string | number, height?: string | number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} className={className} fill="none" overflow="visible" viewBox="0 0 256 256">
    <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" fill={fill}/>
  </svg>
);

export default function Compare() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { resumeText1?: string, resumeText2?: string, fileName1?: string, fileName2?: string };

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function compareResumes() {
      if (!state?.resumeText1 || !state?.resumeText2) {
        navigate('/analyze', { replace: true });
        return;
      }
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${apiUrl}/api/compare-resumes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text1: state.resumeText1, text2: state.resumeText2 })
        });
        if (!response.ok) {
          let errMsg = 'Failed to compare resumes';
          try {
            const errJson = await response.json();
            if (errJson.error) errMsg = errJson.error;
          } catch (e) {}
          throw new Error(errMsg);
        }
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        let finalErr = err.message || 'An error occurred during comparison.';
        setError(finalErr);
      } finally {
        setLoading(false);
      }
    }
    compareResumes();
  }, [state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F8] flex flex-col items-center justify-center font-body text-[#192837]">
        <motion.div 
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="mb-2"
        >
          <Logo width={48} height={48} />
        </motion.div>
        <motion.p 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 0.7, y: 0 }}
          className="mt-6 text-[15px] font-medium"
        >
          Comparing resumes...
        </motion.p>
        <p className="mt-3 text-[13px] opacity-40">This usually takes 15–20 seconds</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F9F9F8] flex flex-col items-center justify-center font-body text-[#192837] p-6 text-center">
        <h2 className="text-xl font-bold mb-4 text-red-600">Error</h2>
        <p className="mb-6 opacity-70 max-w-md">{error || 'Something went wrong.'}</p>
        <Link to="/dashboard" state={{ resumeText: state?.resumeText1, fileName: state?.fileName1 }} className="btn-chamfer px-6 py-2.5 bg-[#192837] text-white font-medium text-sm">
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F8] font-body text-[#192837]">
      <nav className="sticky top-0 z-50 bg-[#F9F9F8]/80 backdrop-blur-md border-b border-[#192837]/5 px-6 lg:px-14 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 font-bold hover:opacity-70 transition-opacity">
          <Logo />
          <span className="hidden sm:inline-block tracking-tight text-[17px]" style={{ fontFamily: 'var(--font-heading)' }}>Resnalyzer</span>
        </Link>
        <Link to="/dashboard" state={{ resumeText: state?.resumeText1, fileName: state?.fileName1 }} className="btn-chamfer inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#192837] text-[13px] font-medium hover:bg-[#192837] hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </nav>

      <main className="w-full max-w-6xl mx-auto px-6 py-10 lg:py-16 flex flex-col gap-10">
        
        <header className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Head-to-Head Comparison</h1>
          <p className="text-[#192837]/70 leading-relaxed text-[15px]">{data.overallSummary}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Resume 1 */}
          <div className="card-chamfer bg-white p-8 border-t-[4px] relative" style={{ borderColor: data.winner === '1' ? 'var(--color-accent)' : 'rgba(25, 40, 55, 0.1)', filter: 'drop-shadow(0 12px 24px rgba(25, 40, 55, 0.05))' }}>
            {data.winner === '1' && (
              <div className="absolute top-4 right-4 bg-green-100 text-green-700 p-2 rounded-full">
                <Trophy className="w-5 h-5" />
              </div>
            )}
            <h2 className="text-xl font-bold mb-1 truncate" style={{ fontFamily: 'var(--font-heading)' }}>{state.fileName1 || "Resume 1"}</h2>
            <div className="text-[13px] opacity-60 mb-6">Candidate A</div>
            <div className="text-4xl font-bold mb-8 text-[var(--color-accent)]">{data.resume1Score}<span className="text-lg opacity-50 text-[#192837]">/100</span></div>
            
            <h3 className="text-[14px] font-bold uppercase tracking-wider opacity-60 mb-4">Key Strengths</h3>
            <ul className="flex flex-col gap-3">
              {data.resume1Strengths.map((str: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-[14.5px]">
                  <Check className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resume 2 */}
          <div className="card-chamfer bg-white p-8 border-t-[4px] relative" style={{ borderColor: data.winner === '2' ? 'var(--color-accent)' : 'rgba(25, 40, 55, 0.1)', filter: 'drop-shadow(0 12px 24px rgba(25, 40, 55, 0.05))' }}>
            {data.winner === '2' && (
              <div className="absolute top-4 right-4 bg-green-100 text-green-700 p-2 rounded-full">
                <Trophy className="w-5 h-5" />
              </div>
            )}
            <h2 className="text-xl font-bold mb-1 truncate" style={{ fontFamily: 'var(--font-heading)' }}>{state.fileName2 || "Resume 2"}</h2>
            <div className="text-[13px] opacity-60 mb-6">Candidate B</div>
            <div className="text-4xl font-bold mb-8 text-[var(--color-accent)]">{data.resume2Score}<span className="text-lg opacity-50 text-[#192837]">/100</span></div>
            
            <h3 className="text-[14px] font-bold uppercase tracking-wider opacity-60 mb-4">Key Strengths</h3>
            <ul className="flex flex-col gap-3">
              {data.resume2Strengths.map((str: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-[14.5px]">
                  <Check className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Detailed Breakdown */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>Detailed Breakdown</h2>
          <div className="flex flex-col gap-4">
            {data.comparisonPoints.map((point: any, idx: number) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-[#192837]/10" style={{ filter: 'drop-shadow(0 4px 8px rgba(25, 40, 55, 0.02))' }}>
                <h3 className="text-[16px] font-bold mb-4 border-b border-[#192837]/10 pb-3">{point.category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <span className="text-[12px] font-semibold uppercase tracking-wider opacity-50">Candidate A</span>
                    <div className="flex items-start gap-3">
                      {point.winner === '1' ? <Check className="w-4 h-4 mt-1 text-green-600 shrink-0" /> : <Minus className="w-4 h-4 mt-1 opacity-20 shrink-0" />}
                      <p className="text-[14px] leading-relaxed">{point.resume1}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[12px] font-semibold uppercase tracking-wider opacity-50">Candidate B</span>
                    <div className="flex items-start gap-3">
                      {point.winner === '2' ? <Check className="w-4 h-4 mt-1 text-green-600 shrink-0" /> : <Minus className="w-4 h-4 mt-1 opacity-20 shrink-0" />}
                      <p className="text-[14px] leading-relaxed">{point.resume2}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
