import React, { ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    // Update state to trigger a re-render with fallback UI
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return <div>Something went wrong.</div>;
    }
    // Render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
