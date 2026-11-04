import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/api';
import {
  PlusCircle,
  FileText,
  Clock,
  CheckCircle,
  Heart,
  Droplet,
  Hospital,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Eye,
  UserCheck
} from 'lucide-react';
import { formatDate, getPriorityBadgeClass, getStatusBadgeClass } from '../utils/compatibility';

const RecipientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipientData = async () => {
      try {
        setLoading(true);
        const res = await requestService.getAllRequests({ myRequests: 'true' });
        if (res.success) {
          setRequests(res.data || []);
        }
      } catch (error) {
        console.error('Error fetching recipient requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipientData();
  }, []);

  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === 'Pending').length;
  const acceptedRequests = requests.filter((r) => r.status === 'Accepted' || r.status === 'Donor Found').length;
  const fulfilledRequests = requests.filter((r) => r.status === 'Fulfilled').length;

  return (
    <DashboardLayout
      title="Recipient Portal"
      subtitle={`Welcome, ${user?.name}. Manage your emergency transfusion requests.`}
    >
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Requests
            </span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{totalRequests}</p>
          <p className="text-[11px] text-slate-400 mt-1">Created by your account</p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2">{pendingRequests}</p>
          <p className="text-[11px] text-slate-400 mt-1">Waiting for donor</p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Accepted / Found
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-2">{acceptedRequests}</p>
          <p className="text-[11px] text-slate-400 mt-1">Donors responded</p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Fulfilled
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">
            {fulfilledRequests}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Transfusion completed</p>
        </div>
      </div>

      {/* Emergency Request Action Callout */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-800/80 text-white text-[11px] font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-white" />
            <span>Emergency Rapid Response</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold">Need blood for a critical patient?</h3>
          <p className="text-xs sm:text-sm text-red-100 max-w-xl">
            Post an emergency request immediately. Matching blood donors in the requested city are immediately notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
          <Link
            to="/create-request"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-red-600 font-bold text-xs sm:text-sm hover:bg-red-50 transition shadow text-center"
          >
            + Create Blood Request
          </Link>
          <Link
            to="/find-donors"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-800/80 hover:bg-red-900 text-white font-semibold text-xs sm:text-sm transition text-center"
          >
            Search Donors Directly
          </Link>
        </div>
      </div>

      {/* Recent Requests Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Your Blood Requests</h3>
            <p className="text-xs text-slate-500 mt-0.5">Live status and donor responses</p>
          </div>
          <Link
            to="/my-requests"
            className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 mt-3">Loading your requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No blood requests posted yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              When you post an emergency or routine request, it will appear here with live donor confirmations.
            </p>
            <Link
              to="/create-request"
              className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Create Your First Request
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Req ID / Patient</th>
                  <th className="px-6 py-3.5">Blood Group</th>
                  <th className="px-6 py-3.5">Hospital</th>
                  <th className="px-6 py-3.5">Priority</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Donors Responded</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {requests.slice(0, 5).map((reqItem) => (
                  <tr key={reqItem._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{reqItem.patientName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        #{reqItem._id.slice(-6).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-xs px-2.5 py-1 bg-red-100 text-red-700 rounded-lg">
                        {reqItem.bloodGroup}
                      </span>
                      <span className="text-[11px] text-slate-500 ml-2">
                        {reqItem.unitsRequired} Unit{reqItem.unitsRequired > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{reqItem.hospitalName}</div>
                      <div className="text-[11px] text-slate-400">{reqItem.city}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getPriorityBadgeClass(
                          reqItem.priority
                        )}`}
                      >
                        {reqItem.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusBadgeClass(
                          reqItem.status
                        )}`}
                      >
                        {reqItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[11px]">
                          {reqItem.donorResponses?.length || 0}
                        </span>
                        <span className="text-[11px] text-slate-500 font-normal">
                          {reqItem.donorResponses?.some((r) => r.response === 'Accepted')
                            ? '(Accepted available)'
                            : ''}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to="/my-requests"
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RecipientDashboard;
