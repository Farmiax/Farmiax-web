import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const PasswordInput = ({ label, value, onChange, placeholder = 'Enter password', error, name, id, required = false }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={id || name}>
          {label} {required && <span style={{ color: 'var(--error)' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          id={id || name}
          name={name}
          className={`form-input ${error ? 'error' : ''}`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          aria-describedby={error ? `${name}-error` : undefined}
          style={{ paddingRight: 44 }}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? 'Hide password' : 'Show password'}
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            color: 'var(--gray-500)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: 4,
          }}
        >
          {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
      {error && <p className="form-error" id={`${name}-error`} role="alert">{error}</p>}
    </div>
  );
};

export default PasswordInput;
