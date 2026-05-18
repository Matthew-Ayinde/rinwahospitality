'use client';

import React from 'react';

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
  error?: string;
}

const AdminSelect = React.forwardRef<HTMLSelectElement, AdminSelectProps>(
  ({ label, options, error, required = false, id, name, className = '', ...rest }, ref) => {
    const selectId = id || name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs uppercase tracking-[0.26em] text-white/50 font-medium mb-2"
          >
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <select
          id={selectId}
          name={name}
          ref={ref}
          required={required}
          className={`w-full border border-white/10 rounded-lg bg-[#041114]/60 px-4 py-2 text-white/90 transition duration-300 focus:border-teal-300/50 focus:bg-[#07171a] focus:outline-none focus:shadow-[0_0_0_4px_rgba(125,211,207,0.08)] disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? 'border-red-400/50' : ''
          } ${className}`}
          {...rest}
        >
          <option value="" disabled>
            Select an option
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-400/90 mt-1">{error}</p>}
      </div>
    );
  }
);

AdminSelect.displayName = 'AdminSelect';

export default AdminSelect;
