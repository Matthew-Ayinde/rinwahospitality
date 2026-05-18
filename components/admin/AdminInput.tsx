'use client';

import React from 'react';

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const AdminInput = React.forwardRef<HTMLInputElement, AdminInputProps>(
  ({ label, error, id, name, className = '', ...rest }, ref) => {
    const inputId = id || name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs uppercase tracking-[0.26em] text-white/50 font-medium mb-2"
          >
            {label}
            {rest.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          name={name}
          ref={ref}
          className={`w-full border border-white/10 rounded-lg bg-[#041114]/60 px-4 py-2 text-white/90 placeholder-white/30 transition duration-300 focus:border-teal-300/50 focus:bg-[#07171a] focus:outline-none focus:shadow-[0_0_0_4px_rgba(125,211,207,0.08)] disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-red-400/50' : ''
          } ${className}`}
          {...rest}
        />
        {error && <p className="text-xs text-red-400/90 mt-1">{error}</p>}
      </div>
    );
  }
);

AdminInput.displayName = 'AdminInput';

export default AdminInput;
