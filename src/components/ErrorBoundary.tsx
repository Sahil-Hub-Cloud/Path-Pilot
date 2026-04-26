'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-6 text-center">
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 16, padding: '60px 40px', maxWidth: 420 }}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>⚠️</div>
            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: 22, marginBottom: 12 }}>Something Went Wrong</h1>
            <p style={{ color: '#94A3B8', fontSize: 14, marginBottom: 32 }}>
              A component error occurred. Click below to reload.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{ background: '#7C3AED', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', width: '100%' }}
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
