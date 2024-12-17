import { Component } from 'react';
import { Link } from 'react-router-dom';
class ErrorBoundary extends Component {
    state = {
        hasError: false,
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error(error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <h2>Something went wrong.</h2>
                    <p>
                        There was an error on this page. <Link to="/">Go back to the home page.</Link>
                    </p>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
