import React, { useEffect, useState, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Download, CheckCircle2, AlertCircle, ExternalLink, MapPin, Mail, Phone, XCircle, Loader2, UploadCloud, Lightbulb, ArrowRight, GitCompare } from 'lucide-react';
import { extractTextFromPdf } from '../lib/pdf';

const Logo = ({ fill = "#192837", width = "32", height = "32", className = "" }: { fill?: string, width?: string | number, height?: string | number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} className={className} fill="none" overflow="visible" viewBox="0 0 256 256">
    <path d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z" fill={fill}/>
  </svg>
);

// --- Helpers ---
const getScoreColorClass = (score: number, type: 'text' | 'bg' | 'stroke' | 'border' = 'text') => {
  if (score >= 85) {
    if (type === 'bg') return 'bg-green-600';
    if (type === 'border') return 'border-green-600';
    if (type === 'stroke') return '#16a34a';
    return 'text-green-600';
  }
  if (score >= 70) {
    if (type === 'bg') return 'bg-amber-600';
    if (type === 'border') return 'border-amber-600';
    if (type === 'stroke') return '#d97706';
    return 'text-amber-600';
  }
  if (type === 'bg') return 'bg-red-600';
  if (type === 'border') return 'border-red-600';
  if (type === 'stroke') return '#dc2626';
  return 'text-red-600';
};

const ScoreGauge = ({ score }: { score: number }) => {
  const radius = 66;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const strokeColor = getScoreColorClass(score, 'stroke');

  return (
    <div className="relative flex items-center justify-center w-[150px] h-[150px]">
      <svg width="150" height="150" className="transform -rotate-90">
        <circle cx="75" cy="75" r={radius} fill="none" stroke="rgba(25, 40, 55, 0.06)" strokeWidth="10" />
        <motion.circle
          cx="75" cy="75" r={radius} fill="none" stroke={strokeColor} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-bold tabular-nums" style={{ fontFamily: 'var(--font-heading)' }}>{score}</span>
        <span className="text-[11px] font-medium opacity-50 uppercase tracking-wider">Out of 100</span>
      </div>
    </div>
  );
};

const LOADING_MESSAGES = [
  "Scanning your experience...",
  "Checking your achievements...",
  "Evaluating your impact...",
  "Finding opportunities to improve...",
  "Structuring the final analysis..."
];

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { resumeText?: string, fileName?: string };
  
  const [activeSection, setActiveSection] = useState('overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  
  const compareInputRef = useRef<HTMLInputElement>(null);
  const [isComparing, setIsComparing] = useState(false);

  const handleCompareFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        alert("Please upload a valid PDF document to compare.");
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File is too large. Please upload a PDF under 5MB.");
        return;
      }
      setIsComparing(true);
      try {
        const extractedText = await extractTextFromPdf(selectedFile);
        navigate('/compare', { 
          state: { 
            resumeText1: state.resumeText, 
            resumeText2: extractedText,
            fileName1: state.fileName,
            fileName2: selectedFile.name
          } 
        });
      } catch (err) {
        console.error("Error reading file:", err);
        alert("Failed to read PDF file.");
      } finally {
        setIsComparing(false);
      }
    }
  };

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [loading]);

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills & Tools' },
    { id: 'keywords', label: 'Keyword Match' },
    { id: 'recommendations', label: 'Recommendations' },
  ];

  useEffect(() => {
    async function analyzeResume() {
      if (!state?.resumeText) {
        setError('No resume text found. Please upload a resume first.');
        setLoading(false);
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${apiUrl}/api/analyze-resume`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: state.resumeText })
        });

        if (!response.ok) {
          let errMsg = 'Failed to analyze resume';
          try {
            const errJson = await response.json();
            if (errJson.error) errMsg = errJson.error;
          } catch (e) {}
          throw new Error(errMsg);
        }

        const result = await response.json();
        setData(result);
      } catch (err: any) {
        let finalErr = err.message || 'An error occurred during analysis.';
        
        // Sanitize technical errors
        if (
          finalErr.includes('Unexpected token') || 
          finalErr.includes('JSON') || 
          finalErr.includes('Failed to fetch') ||
          finalErr.includes('NetworkError') ||
          finalErr.includes('ApiError') ||
          finalErr.includes('502') ||
          finalErr.includes('503') ||
          finalErr.includes('504')
        ) {
          finalErr = "We couldn't reach the analysis server. Please check your connection and try again.";
        }
        
        // Soften quota/AI errors
        if (finalErr.includes('quota') || finalErr.includes('429')) {
          finalErr = "Our service is currently experiencing very high traffic. Please try again in a few minutes.";
        }
        
        setError(finalErr);
      } finally {
        setLoading(false);
      }
    }

    analyzeResume();
  }, [state?.resumeText]);

  useEffect(() => {
    if (loading || error) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loading, error]);

  const filename = state?.fileName || 'candidate_resume.pdf';

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
          key={messageIndex}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 0.7, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.4 }}
          className="mt-6 text-[15px] font-medium"
        >
          {LOADING_MESSAGES[messageIndex]}
        </motion.p>
        <p className="mt-3 text-[13px] opacity-40">This usually takes 15–20 seconds</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F9F9F8] flex flex-col items-center justify-center font-body text-[#192837] p-6">
        <div className="card-chamfer bg-white p-8 sm:p-12 max-w-md w-full flex flex-col items-center text-center shadow-sm">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            Analysis Failed
          </h2>
          <p className="text-[14.5px] opacity-70 mb-8 leading-relaxed">
            {error || "We couldn't analyze the document. Please try again."}
          </p>
          <button 
            onClick={() => navigate('/')}
            className="btn-chamfer w-full px-6 py-3 bg-[var(--color-accent)] text-white text-[14px] font-medium hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F8] text-[#192837] font-body flex flex-col lg:flex-row">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-full lg:w-[264px] lg:h-screen lg:sticky top-0 bg-[#F9F9F8] border-b lg:border-b-0 lg:border-r border-[#192837]/10 flex flex-col z-40 shrink-0">
        
        {/* Brand */}
        <div className="px-6 py-4 lg:pt-8 flex items-center gap-3">
          <Logo />
          <span className="font-bold text-sm tracking-wide uppercase" style={{ fontFamily: 'var(--font-heading)' }}>Resnalyzer</span>
        </div>

        {/* Candidate Mini Profile */}
        <div className="px-6 pb-6 border-b border-[#192837]/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#192837] text-white flex items-center justify-center font-bold text-sm shrink-0">
            {(data.candidate?.name || 'C').split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
          </div>
          <div className="overflow-hidden">
            <div className="font-semibold text-sm truncate">{data.candidate?.name || "Anonymous Candidate"}</div>
            <div className="text-[12.5px] opacity-60 truncate">{data.candidate?.role || "Unspecified Role"}</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-x-auto lg:overflow-y-auto custom-scrollbar p-2 lg:p-4 flex flex-row lg:flex-col gap-2">
          {sections.map(s => (
            <a 
              key={s.id} 
              href={`#${s.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' });
                setActiveSection(s.id);
              }}
              className={`px-4 py-2.5 text-[13.5px] whitespace-nowrap transition-all ${
                activeSection === s.id 
                  ? 'rounded-md bg-[var(--color-accent)] text-white font-medium shadow-sm' 
                  : 'rounded-md font-normal opacity-70 hover:bg-black/5 hover:opacity-100'
              }`}
            >
              {s.label}
            </a>
          ))}
        </nav>

        {/* Footer Meta */}
        <div className="p-6 border-t border-[#192837]/5 hidden lg:block">
          <div className="text-[11.5px] opacity-60 font-medium mb-1 truncate">File: {filename}</div>
          <div className="text-[11.5px] opacity-60 font-medium mb-4">Analyzed: {new Date().toLocaleDateString()}</div>
          <input 
            type="file" 
            ref={compareInputRef} 
            className="hidden" 
            accept="application/pdf"
            onChange={handleCompareFile} 
          />
          <button 
            onClick={() => compareInputRef.current?.click()}
            disabled={isComparing}
            className="btn-chamfer w-full flex items-center justify-center gap-2 py-2.5 bg-[#192837] text-white text-[13px] font-medium hover:bg-[var(--color-accent)] disabled:opacity-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
          >
            {isComparing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <GitCompare className="w-4 h-4" />
            )}
            Compare Resume
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 w-full max-w-[1040px] mx-auto px-6 py-10 lg:px-14 lg:py-16 flex flex-col gap-10">
        
        {/* Top actions */}
        <div className="w-full flex justify-end">
          <Link to="/" className="btn-chamfer inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#192837] text-[13px] font-medium hover:bg-[#192837] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Header / Hero */}
        <section id="overview" className="scroll-mt-24 flex flex-col xl:flex-row gap-10 xl:items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl md:text-[42px] font-medium leading-tight mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {data.candidate?.name || "Anonymous Candidate"}
            </h1>
            <div className="text-base font-medium opacity-80 mb-2">{data.candidate?.role}</div>
            <p className="text-[15px] opacity-70 max-w-xl leading-relaxed mb-8">{data.candidate?.descriptor}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 max-w-lg">
              {data.candidate?.contact?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 opacity-40 shrink-0" />
                  <span className="text-[13px] font-medium truncate" title={data.candidate.contact.email}>{data.candidate.contact.email}</span>
                </div>
              )}
              {data.candidate?.contact?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 opacity-40 shrink-0" />
                  <span className="text-[13px] font-medium truncate" title={data.candidate.contact.phone}>{data.candidate.contact.phone}</span>
                </div>
              )}
              {data.candidate?.contact?.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 opacity-40 shrink-0" />
                  <span className="text-[13px] font-medium truncate" title={data.candidate.contact.location}>{data.candidate.contact.location}</span>
                </div>
              )}
              {data.candidate?.contact?.linkedin && (
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-4 h-4 opacity-40 shrink-0" />
                  <span className="text-[13px] font-medium truncate" title={data.candidate.contact.linkedin}>{data.candidate.contact.linkedin}</span>
                </div>
              )}
              {data.candidate?.contact?.github && (
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-4 h-4 opacity-40 shrink-0" />
                  <span className="text-[13px] font-medium truncate" title={data.candidate.contact.github}>{data.candidate.contact.github}</span>
                </div>
              )}
              {data.candidate?.contact?.portfolio && (
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-4 h-4 opacity-40 shrink-0" />
                  <span className="text-[13px] font-medium truncate" title={data.candidate.contact.portfolio}>{data.candidate.contact.portfolio}</span>
                </div>
              )}
            </div>
          </div>

          <div className="card-chamfer bg-white p-8 flex flex-col sm:flex-row xl:flex-col items-center gap-8 min-w-[280px]">
            <ScoreGauge score={data.overallScore} />
            <div className="text-center sm:text-left xl:text-center">
              <div className={`text-lg font-bold mb-1 ${getScoreColorClass(data.overallScore)}`} style={{ fontFamily: 'var(--font-heading)' }}>
                {data.verdict}
              </div>
              <div className="text-[13px] opacity-60 leading-relaxed max-w-[200px]">
                The resume demonstrates strong alignment, with minor formatting adjustments recommended.
              </div>
            </div>
          </div>
        </section>

        {/* Summary Stats */}
        <section>
          <div className="card-chamfer bg-white flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-[#192837]/10">
            {data.summaryStats?.map((stat, i) => (
              <div key={i} className="flex-1 p-6 text-center sm:text-left">
                <div className="text-2xl font-bold tabular-nums mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{stat.value}</div>
                <div className="text-[12px] font-medium opacity-60 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Score Breakdown */}
        <section className="flex flex-col gap-6">
          <h2 className="text-[22px] font-medium" style={{ fontFamily: 'var(--font-heading)' }}>Score Breakdown</h2>
          <div className="flex flex-col gap-8">
            {data.scoreBreakdown?.map((item, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[14px] font-medium">{item.label}</span>
                  <span className={`text-[14px] font-bold tabular-nums ${getScoreColorClass(item.score)}`}>{item.score}</span>
                </div>
                <div className="w-full h-[6px] bg-[#192837]/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 0.8, delay: 0.1 * i, ease: "easeOut" }}
                    className={`h-full rounded-full ${getScoreColorClass(item.score, 'bg')}`}
                  />
                </div>
                <p className="text-[13px] opacity-60 mt-1">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-[#192837]/10" />

        {/* Work History */}
        <section id="experience" className="scroll-mt-24 flex flex-col gap-8">
          <h2 className="text-[22px] font-medium" style={{ fontFamily: 'var(--font-heading)' }}>Work History</h2>
          <div className="pl-2 border-l-[1.5px] border-[#192837]/10 flex flex-col gap-10 relative">
            {data.workHistory?.map((job, i) => (
              <div key={i} className="relative pl-6">
                <div className="absolute -left-[3.5px] top-[6px] w-[9px] h-[9px] rounded-full bg-[#192837] border-2 border-[#F9F9F8] box-content" />
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-2">
                  <h3 className="text-[16px] font-semibold">{job.title}</h3>
                  <span className="text-[13.5px] opacity-60 font-medium tabular-nums shrink-0">{job.dates}</span>
                </div>
                <div className="text-[14px] opacity-80 mb-4">{job.company} • {job.location}</div>
                <ul className="flex flex-col gap-2 mb-4">
                  {job.bullets?.map((bullet, j) => (
                    <li key={j} className="text-[14px] opacity-70 leading-relaxed relative pl-4">
                      <span className="absolute left-0 top-[8px] w-1 h-1 rounded-full bg-[#192837]/30" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                {job.quantifiedAchievements > 0 && (
                  <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-[5px] text-[12px] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {job.quantifiedAchievements} Quantified Achievement{job.quantifiedAchievements > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <hr className="border-[#192837]/10" />

        {/* Education */}
        <section id="education" className="scroll-mt-24 flex flex-col gap-6">
          <h2 className="text-[22px] font-medium" style={{ fontFamily: 'var(--font-heading)' }}>Education</h2>
          <div className="flex flex-col divide-y divide-[#192837]/10 border-y border-[#192837]/10">
            {data.education?.map((edu, i) => (
              <div key={i} className="py-5 flex flex-col sm:flex-row justify-between gap-2">
                <div>
                  <div className="text-[15px] font-semibold mb-1">{edu.degree}</div>
                  <div className="text-[14px] opacity-70">{edu.institution}</div>
                </div>
                <div className="text-[13.5px] opacity-60 font-medium">{edu.dates}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="scroll-mt-24 flex flex-col gap-8">
          <h2 className="text-[22px] font-medium" style={{ fontFamily: 'var(--font-heading)' }}>Skills & Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.skills?.map((group, i) => (
              <div key={i} className="flex flex-col gap-4">
                <h3 className="text-[14px] font-semibold opacity-70 uppercase tracking-wide">{group.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items?.map((skill, j) => (
                    <div key={j} className="bg-white border border-[#192837]/10 rounded-[6px] px-3 py-1.5 text-[13px] font-medium">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Keywords */}
        <section id="keywords" className="scroll-mt-24 flex flex-col gap-6">
          <h2 className="text-[22px] font-medium" style={{ fontFamily: 'var(--font-heading)' }}>Keyword Match</h2>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className="border-b-2 border-[#192837]/10">
                  <th className="pb-3 text-[12px] font-semibold opacity-60 uppercase tracking-wider w-1/2">Job Requirement</th>
                  <th className="pb-3 text-[12px] font-semibold opacity-60 uppercase tracking-wider w-1/4">Status</th>
                  <th className="pb-3 text-[12px] font-semibold opacity-60 uppercase tracking-wider w-1/4">Mentions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#192837]/5">
                {data.keywordMatches?.map((kw, i) => {
                  let statusColor = "text-[#192837]";
                  if (kw.status === "Found") statusColor = "text-green-600";
                  if (kw.status === "Partially found") statusColor = "text-amber-600";
                  if (kw.status === "Not found") statusColor = "text-red-600";

                  return (
                    <tr key={i}>
                      <td className="py-4 text-[14px] font-medium">{kw.requirement}</td>
                      <td className={`py-4 text-[14px] font-medium ${statusColor}`}>{kw.status}</td>
                      <td className="py-4 text-[14px] opacity-70">{kw.mentions}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        <hr className="border-[#192837]/10" />

        {/* Recommendations */}
        <section id="recommendations" className="scroll-mt-24 flex flex-col gap-6">
          <h2 className="text-[22px] font-medium" style={{ fontFamily: 'var(--font-heading)' }}>Prioritized Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.recommendations?.map((rec: any, i: number) => (
              <div 
                key={i} 
                className="transition-all"
                style={{
                  filter: 'drop-shadow(0 12px 24px rgba(25, 40, 55, 0.05)) drop-shadow(0 4px 8px rgba(25, 40, 55, 0.03))'
                }}
              >
                <div 
                  className={`card-chamfer h-full relative overflow-hidden bg-white p-7 flex flex-col gap-5 ${
                    rec.critical ? 'border-t-[3px] border-t-red-500' : 'border-t-[3px] border-t-amber-500'
                  }`}
                >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      rec.critical ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                    }`}>
                      {rec.critical ? <AlertCircle className="w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
                    </div>
                    <span className={`text-[11px] uppercase tracking-widest font-bold ${
                      rec.critical ? 'text-red-500' : 'text-amber-500'
                    }`}>
                      {rec.critical ? 'Priority Fix' : 'Enhancement'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-[17px] font-semibold text-[#192837] mb-2 leading-snug">{rec.title}</h3>
                  <p className="text-[14.5px] text-[#192837]/70 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-[#192837]/10 text-[12px] opacity-50 text-center leading-relaxed pb-8">
          This report reflects the content of the uploaded resume as of the analysis date ({new Date().toLocaleDateString()}) 
          and does not access external sources to verify claims.
        </footer>
      </main>
    </div>
  );
}
