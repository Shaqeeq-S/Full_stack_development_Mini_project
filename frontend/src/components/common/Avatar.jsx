import React, { useState } from 'react';

const Avatar = ({
  src,
  name = 'User',
  size = 'md',
  className = '',
  role,
  border = true
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeMap = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-bold',
    xl: 'w-20 h-20 text-xl font-bold',
    '2xl': 'w-24 h-24 text-2xl font-bold'
  };

  const initial = name ? name.charAt(0).toUpperCase() : 'U';

  const hasValidImage = src && src.trim() !== '' && !imageError;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden select-none ${
        sizeMap[size] || sizeMap.md
      } ${
        border ? 'ring-2 ring-white shadow-sm' : ''
      } ${className}`}
    >
      {hasValidImage ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-red-600 to-rose-700 text-white font-bold flex items-center justify-center shadow-inner">
          {initial}
        </div>
      )}
    </div>
  );
};

export default Avatar;
