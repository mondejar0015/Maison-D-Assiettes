import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Show immediate loading screen
const rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.innerHTML = `
    <div style="
      min-height: 100vh;
      background: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: system-ui, -apple-system, sans-serif;
    ">
      <div style="
        width: 160px;
        height: 160px;
        border-radius: 50%;
        border: 4px solid #60a5fa;
        background: white;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 24px;
      ">
        <div style="position: relative; width: 96px; height: 112px; display: flex; align-items: center; justify-content: center;">
          <div style="
            position: absolute;
            inset: 0;
            background: #1e3a8a;
            border-radius: 50% 50% 0 0;
            clip-path: polygon(50% 0%, 100% 0%, 85% 100%, 15% 100%, 0% 0%);
          "></div>
          <div style="position: relative; z-index: 10; text-align: center; margin-top: 16px;">
            <div style="color: #fbbf24; font-size: 12px; font-weight: bold; margin-bottom: 4px;">⚜️</div>
            <div style="color: white; font-size: 6px; font-weight: bold; line-height: 1.2; padding: 0 8px;">
              MAISON<br />D'ASSIETTES
            </div>
          </div>
        </div>
      </div>
      <h2 style="font-size: 18px; font-weight: 600; color: #1e3a8a; margin-bottom: 16px;">Loading...</h2>
      <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 32px;">
        <div style="width: 12px; height: 12px; border-radius: 50%; background: #60a5fa; animation: bounce 1s infinite;"></div>
        <div style="width: 12px; height: 12px; border-radius: 50%; background: #2dd4bf; animation: bounce 1s infinite; animation-delay: 0.1s;"></div>
        <div style="width: 12px; height: 12px; border-radius: 50%; background: #93c5fd; animation: bounce 1s infinite; animation-delay: 0.2s;"></div>
      </div>
      <p style="font-size: 14px; color: #4b5563;">Preparing your antique experience</p>
      <style>
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      </style>
    </div>
  `;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-2">Error: {this.state.error?.message || "Unknown error"}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
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

// NO StrictMode - it causes double renders in development
createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);