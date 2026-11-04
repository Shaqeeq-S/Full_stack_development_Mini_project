import React from 'react';
import { ArrowRight, CheckCircle, XCircle, Eye } from 'lucide-react';

const RequestCard = ({ request, onSelect, onMarkFulfilled, onCancel, actionLoading }) => {
  const { patientName, bloodGroup, unitsRequired, hospitalName, city, state, priority, status, donorResponses } = request;

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4 flex flex-col justify-between">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-slate-900">{patientName}</h3>
        <p className="text-xs text-slate-500">#{request._id.slice(-6).toUpperCase()} • {new Date(request.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="flex items-center gap-2 text-sm mb-2">
        <span className="font-extrabold text-xs px-2.5 py-1 bg-red-100 text-red-700 rounded-lg">{bloodGroup}</span>
        <span>{unitsRequired} Unit{unitsRequired > 1 ? 's' : ''}</span>
      </div>
      <div className="text-xs text-slate-600 mb-2">
        <p>{hospitalName}</p>
        <p>{city}, {state}</p>
      </div>
      <div className="flex items-center justify-between text-xs mb-2">
        <span className={`px-2 py-0.5 rounded-full text-xs uppercase font-bold ${
          priority === 'High' ? 'bg-red-200 text-red-800' :
          priority === 'Medium' ? 'bg-amber-200 text-amber-800' :
          'bg-green-200 text-green-800'}
        `}>{priority}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          status === 'Accepted' ? 'bg-blue-100 text-blue-800' :
          status === 'Fulfilled' ? 'bg-emerald-100 text-emerald-800' :
          status === 'Cancelled' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'}
        `}>{status}</span>
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => onSelect(request)}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-sm"
        >
          {donorResponses?.length || 0} Donor(s) <Eye className="w-3.5 h-3.5" />
        </button>
        <div className="space-x-2">
          {status !== 'Fulfilled' && status !== 'Cancelled' && (
            <>
              <button
                onClick={() => onMarkFulfilled(request._id)}
                disabled={actionLoading === request._id}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-sm"
              >
                Mark Fulfilled
              </button>
              <button
                onClick={() => onCancel(request._id)}
                disabled={actionLoading === request._id}
                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
