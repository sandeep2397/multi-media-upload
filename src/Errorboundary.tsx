/*
©2022 Pivotree | All rights reserved
*/
import React from 'react';
// import ErrorDialog from './components/dialog/ErrorDialog';

interface Props {
  children: any;
}

interface State {
  hasError?: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: any, info: any) {
    console.log('ERROR LOGS---->', error);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <div>UncaughtError.......................</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
