import React from 'react';
import { MapPin, Calendar, Send } from 'lucide-react';
import BloodBadge from '../common/BloodBadge';
import Avatar from '../common/Avatar';
import { formatDate } from '../../utils/compatibility';

const DonorCard = ({ donor, onRequest }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-red-300 transition-all duration-300 p-6 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Avatar src={donor.avatar} name={donor.name} size="md" className="group-hover:ring-red-300 transition" />
            <div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition">{donor.name}</h4>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {donor.city}, {donor.state} ({donor.pincode})
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <BloodBadge bloodGroup={donor.bloodGroup} />
            {donor.isExactMatch ? (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 block mt-1">
                Exact Match
              </span>
            ) : (
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 block mt-1">
                Compatible
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Status:</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Available
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Last Donation:</span>
            <span className="font-medium text-slate-700">
              {donor.lastDonationDate ? formatDate(donor.lastDonationDate) : 'Eligible'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100">
        <button
          onClick={() => onRequest && onRequest(donor)}
          className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-semibold text-xs transition flex items-center justify-center gap-2 border border-red-200 hover:border-transparent"
        >
          <Send className="w-3.5 h-3.5" />
          Request Donor for Transfusion
        </button>
      </div>
    </div>
  );
};

export default DonorCard;
