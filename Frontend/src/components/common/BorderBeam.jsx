const BorderBeam = ({
  duration = 7,
  borderWidth = 1.5,
  colorFrom = '#166534',
  colorTo = '#86efac',
  className = '',
}) => {
  return (
    <div
      className={`border-beam-container ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        borderRadius: 'inherit',
        overflow: 'hidden',
      }}
    >
      <div
        className="border-beam-glow"
        style={{
          position: 'absolute',
          inset: '-2px',
          borderRadius: 'inherit',
          padding: `${borderWidth}px`,
          background: `conic-gradient(from 0deg, transparent 0%, ${colorFrom} 25%, ${colorTo} 50%, transparent 75%)`,
          animation: `border-beam-spin ${duration}s linear infinite`,
        }}
      />
    </div>
  );
};

export default BorderBeam;
