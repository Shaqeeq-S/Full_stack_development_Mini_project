import React from 'react';
import { Hospital, MapPin, Calendar, Phone } from 'lucide-react';
import { formatDate, getPriorityBadgeClass, getStatusBadgeClass } from '../../utils/compatibility';

const RequestCard = ({ request, onManage }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-xs px-2.5 py-1 bg-red-600 text-white rounded-lg">
            {request.bloodGroup}
          </span>
          <span className="text-xs font-semibold text-slate-800">
            {request.unitsRequired} Unit(s)
          </span>
        </div>
        <span
          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getPriorityBadgeClass(
            request.priority
          )}`}
        >
          {request.priority}
        </span>
      </div>

      <div>
        <h4 className="font-bold text-slate-900 text-sm">{request.patientName}</h4>
        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
          <Hospital className="w-3.5 h-3.5 text-slate-400" />
          <span>{request.hospitalName}</span>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {request.city}, {request.state}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusBadgeClass(
            request.status
          )}`}
        >
          {request.status}
        </span>
        <button
          onClick={() => onManage && onManage(request)}
          className="text-red-600 font-semibold hover:underline"
        >
          Manage Details &rarr;
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
