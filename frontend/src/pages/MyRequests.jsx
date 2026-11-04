import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { requestService } from '../services/api';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Hospital,
  MapPin,
  Calendar,
  AlertTriangle,
  UserCheck,
  Eye,
  PlusCircle,
  X,
  Phone,
  Droplet
} from 'lucide-react';
import { formatDate, getPriorityBadgeClass, getStatusBadgeClass } from '../utils/compatibility';
import { useNotification } from '../context/NotificationContext';
import RequestCard from '../components/RequestCard';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const { notifySuccess, notifyError } = useNotification();

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const res = await requestService.getAllRequests({ myRequests: 'true' });
      if (res.success) {
        setRequests(res.data || []);
      }
    } catch (error) {
      console.error('Error fetching my requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const handleCancelRequest = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this blood request?')) return;
    try {
      setActionLoading(id);
      const res = await requestService.cancelRequest(id);
      if (res.success) {
        notifySuccess('Blood request cancelled successfully.');
        fetchMyRequests();
        if (selectedRequest?._id === id) setSelectedRequest(null);
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
      notifyError(error.response?.data?.message || 'Failed to cancel request.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkFulfilled = async (id) => {
    try {
      setActionLoading(id);
      const res = await requestService.updateStatus(id, 'Fulfilled');
      if (res.success) {
        notifySuccess('Blood request marked as Fulfilled. Thank you for using BloodConnect!');
        fetchMyRequests();
        if (selectedRequest?._id === id) {
          setSelectedRequest({ ...selectedRequest, status: 'Fulfilled' });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      notifyError(error.response?.data?.message || 'Failed to update request status.');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRequests =
    filterStatus === 'All'
      ? requests
      : requests.filter((r) => r.status.toLowerCase() === filterStatus.toLowerCase());

  return (
    <DashboardLayout
      title="My Blood Requests"
      subtitle="Track your posted transfusion requests and volunteer donor confirmations."
    >
      {/* Header controls: Filter buttons & Create CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Pending', 'Accepted', 'Fulfilled', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterStatus === status
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <Link
          to="/create-request"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Post New Request
        </Link>
      </div>

      {/* Main Card Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-4">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 mt-3">Loading your requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No requests found</p>
            <p className="text-xs text-slate-400 mt-1">
              {filterStatus === 'All'
                ? "You haven't posted any blood requests yet."
                : `No requests with status '${filterStatus}'.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredRequests.map((reqItem) => (
              <RequestCard
                key={reqItem._id}
                request={reqItem}
                onSelect={setSelectedRequest}
                onMarkFulfilled={handleMarkFulfilled}
                onCancel={handleCancelRequest}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details & Donor Responses Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                  Request #{selectedRequest._id.slice(-6).toUpperCase()}
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedRequest.patientName} ({selectedRequest.bloodGroup})
                </h3>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Request Summary info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block font-medium">Hospital:</span>
                <span className="font-semibold text-slate-800">{selectedRequest.hospitalName}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Location:</span>
                <span className="font-semibold text-slate-800">
                  {selectedRequest.city}, {selectedRequest.state}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Units Needed:</span>
                <span className="font-semibold text-slate-800">
                  {selectedRequest.unitsRequired} Unit(s)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Priority:</span>
                <span
                  className={`inline-block font-bold mt-0.5 px-2 py-0.5 rounded-full ${getPriorityBadgeClass(
                    selectedRequest.priority
                  )}`}
                >
                  {selectedRequest.priority}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Status:</span>
                <span
                  className={`inline-block font-semibold mt-0.5 px-2 py-0.5 rounded-full ${getStatusBadgeClass(
                    selectedRequest.status
                  )}`}
                >
                  {selectedRequest.status}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Attendant Contact:</span>
                <span className="font-semibold text-slate-800">
                  {selectedRequest.contactNumber}
                </span>
              </div>
            </div>

            {selectedRequest.additionalNotes && (
              <div className="text-xs bg-amber-50/70 border border-amber-200 p-3 rounded-xl text-amber-900">
                <span className="font-bold block mb-0.5">Clinical Note:</span>
                "{selectedRequest.additionalNotes}"
              </div>
            )}

            {/* Donor Responses List */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>Volunteer Donor Responses ({selectedRequest.donorResponses?.length || 0})</span>
              </h4>

              {!selectedRequest.donorResponses || selectedRequest.donorResponses.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
                  No donors have responded yet. Compatible donors in {selectedRequest.city} have been alerted.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedRequest.donorResponses.map((resp, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">
                            {resp.donorUserId?.name || 'Verified Donor'}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              resp.response === 'Accepted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {resp.response}
                          </span>
                        </div>
                        {resp.donorUserId?.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>Direct Contact: {resp.donorUserId.phone}</span>
                          </div>
                        )}
                        {resp.message && (
                          <p className="text-xs text-slate-500 italic mt-1">"{resp.message}"</p>
                        )}
                      </div>

                      <div className="text-right text-[11px] text-slate-400">
                        {formatDate(resp.respondedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyRequests;
