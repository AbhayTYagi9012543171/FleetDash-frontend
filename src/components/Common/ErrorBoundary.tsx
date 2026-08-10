
import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
      error: undefined,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("❌ Error Boundary:", error);
    console.error("📋 Error Info:", errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = "/";
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 px-6 sm:px-8 py-8 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shrink-0">
                    ⚠️
                  </div>

                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">
                      Something Went Wrong
                    </h1>

                    <p className="text-red-100 mt-2">
                      FleetDash encountered an unexpected error.
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                  <h2 className="text-lg font-semibold text-slate-800">
                    What happened?
                  </h2>

                  <p className="text-sm text-gray-600 mt-2 leading-6">
                    The application could not display this page correctly.
                    You can try reloading the application or return to the
                    dashboard.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    type="button"
                    onClick={this.handleReload}
                    className="
                      flex-1
                      bg-blue-600
                      hover:bg-blue-700
                      active:bg-blue-800
                      text-white
                      px-6
                      py-3
                      rounded-xl
                      font-semibold
                      transition-all
                      duration-200
                      shadow-sm
                      hover:shadow-md
                    "
                  >
                    🔄 Reload Application
                  </button>

                  <button
                    type="button"
                    onClick={this.handleGoHome}
                    className="
                      flex-1
                      bg-gray-100
                      hover:bg-gray-200
                      active:bg-gray-300
                      text-slate-700
                      px-6
                      py-3
                      rounded-xl
                      font-semibold
                      transition-all
                      duration-200
                    "
                  >
                    🏠 Go to Home
                  </button>
                </div>

                {/* Development Error Details */}
                {import.meta.env.DEV && this.state.error && (
                  <details className="mt-6">
                    <summary className="cursor-pointer select-none text-sm font-semibold text-red-600 hover:text-red-700">
                      🔧 Show Development Error Details
                    </summary>

                    <div className="mt-3 rounded-xl bg-slate-950 p-4 overflow-auto">
                      <p className="text-sm font-semibold text-red-400 mb-2">
                        {this.state.error.name}
                      </p>

                      <pre className="text-xs text-gray-300 whitespace-pre-wrap break-words leading-5">
                        {this.state.error.message}
                        {"\n\n"}
                        {this.state.error.stack}
                      </pre>
                    </div>
                  </details>
                )}

                {/* Footer */}
                <div className="mt-8 pt-5 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-400">
                    FleetDash • Fleet Management System
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

