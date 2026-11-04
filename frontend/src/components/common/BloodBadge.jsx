import React from 'react';

const BloodBadge = ({ bloodGroup, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-base',
    lg: 'w-14 h-14 text-xl'
  };

  return (
    <div
      className={`rounded-xl bg-red-600 text-white font-extrabold flex items-center justify-center shadow-sm shadow-red-200 select-none ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      {bloodGroup}
    </div>
  );
};

export default BloodBadge;
