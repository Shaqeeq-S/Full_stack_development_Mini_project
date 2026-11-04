import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'red' }) => {
  const colorMap = {
    red: 'bg-red-50 text-red-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
    slate: 'bg-slate-100 text-slate-600'
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          {title}
        </span>
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{value}</p>
        {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {Icon && (
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            colorMap[color] || colorMap.red
          }`}
        >
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
