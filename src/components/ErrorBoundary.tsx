import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F9F9F8] flex flex-col items-center justify-center font-body text-[#192837] p-6">
          <div className="card-chamfer bg-white p-8 sm:p-12 max-w-md w-full flex flex-col items-center text-center shadow-sm">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
              Something went wrong
            </h2>
            <p className="text-[14.5px] opacity-70 mb-8 leading-relaxed">
              We encountered an unexpected error. Please try returning to the home page or refreshing the application.
            </p>
            <button 
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="btn-chamfer w-full px-6 py-3 bg-[var(--color-accent)] text-white text-[14px] font-medium hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
