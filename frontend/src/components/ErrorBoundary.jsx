import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.state = { hasError: true, error, errorInfo };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ color: '#d32f2f' }}>Something went wrong</h1>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
            <summary style={{ cursor: 'pointer', fontSize: '18px', marginBottom: '10px' }}>
              Click to see error details
            </summary>
            <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '14px' }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>Error:</strong> {this.state.error && this.state.error.toString()}
              </div>
              {this.state.errorInfo && (
                <div>
                  <strong>Component Stack:</strong>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </div>
              )}
            </div>
          </details>
          <button
            onClick={() => window.location.href = '/ASLDuolingo/learn'}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              fontSize: '16px',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Go to Learning Path
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
