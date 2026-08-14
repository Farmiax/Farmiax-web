import { FiAlertTriangle } from 'react-icons/fi';

const ErrorState = ({ message = 'Something went wrong. Please try again.', onRetry }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: '#fee2e2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
      }}>
        <FiAlertTriangle size={36} color="#dc2626" />
      </div>
      <h3 style={{ fontSize: '1.25rem', color: 'var(--gray-800)', marginBottom: 8 }}>
        Oops! Something went wrong
      </h3>
      <p style={{ color: 'var(--gray-500)', fontSize: '15px', maxWidth: 400, marginBottom: onRetry ? 20 : 0 }}>
        {message}
      </p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>Try Again</button>
      )}
    </div>
  );
};

export default ErrorState;
