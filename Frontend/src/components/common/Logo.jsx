import logoPng from '../../assets/logo.png';

const Logo = ({ size = 'md', variant = 'default', className = '' }) => {
  const heights = {
    sm: 36,
    md: 46,
    lg: 60,
    xl: 76,
  };

  const h = heights[size] || heights.md;

  return (
    <div
      className={`farmiax-logo ${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1,
      }}
    >
      <img
        src={logoPng}
        alt="Farmiax — Real Farms. Real Food."
        style={{
          height: h,
          width: 'auto',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </div>
  );
};

export default Logo;
