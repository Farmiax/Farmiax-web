const LoadingState = ({ message = 'Loading...', fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="page-loader">
        <div className="loader-spinner" />
        <p style={{ color: 'var(--gray-500)', fontSize: '15px' }}>{message}</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      gap: '12px',
    }}>
      <div className="loader-spinner" />
      <p style={{ color: 'var(--gray-500)', fontSize: '14px' }}>{message}</p>
    </div>
  );
};

export default LoadingState;
