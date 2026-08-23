'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { toast } from '@/lib/toast';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    // Raise the error up so the parent can see it (e.g., log to service)
    console.error('ErrorBoundary caught:', error);
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Optionally send to error‑tracking service
    console.error('ErrorBoundary componentDidCatch:', error, errorInfo);

    // Show a non‑blocking toast so the user knows something went wrong
    toast.error(`Oops! ${error.message}`);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--bg-cream)] text-[var(--text-dark)] flex items-center justify-center p-6">
          <div className="clay-card p-8 max-w-sm w-full">
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <h1 style={{ color: 'var(--peacock-blue)', fontWeight: 900, fontSize: 20, marginBottom: 12 }}>
              Something Went Wrong
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
              {this.state.errorMessage}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-peacock-blue w-full py-3 px-6 rounded-xl font-semibold text-white"
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
