import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4" dir="rtl">
          <h1 className="text-3xl font-bold text-red-500 mb-4">حدث خطأ غير متوقع</h1>
          <p className="text-gray-400 mb-4">نعتذر عن هذا الخطأ. يرجى التأكد من تنفيذ أوامر SQL المطلوبة في Supabase.</p>
          <div className="bg-gray-900 p-4 rounded text-sm text-red-300 overflow-auto max-w-full text-left" dir="ltr">
            {this.state.error?.message}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-bold"
          >
            تحديث الصفحة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
