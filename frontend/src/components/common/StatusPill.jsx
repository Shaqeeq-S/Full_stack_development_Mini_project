import React from 'react';
import { getStatusBadgeClass } from '../../utils/compatibility';

const StatusPill = ({ status }) => {
  return (
    <span
      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${getStatusBadgeClass(
        status
      )}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
      {status}
    </span>
  );
};

export default StatusPill;
