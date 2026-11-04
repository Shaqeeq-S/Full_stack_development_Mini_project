import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { donorService, requestService } from '../services/api';
import {
  Droplet,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  Hospital,
  AlertTriangle,
  User,
  Phone,
  Edit,
  Save,
  Check,
  X,
  Share2
} from 'lucide-react';
import { formatDate, getPriorityBadgeClass, getStatusBadgeClass } from '../utils/compatibility';

const DonorDashboard = () => {
  const { user, updateCurrentUser, toggleDonorAvailability } = useAuth();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ totalReceived: 0, accepted: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  // Profile Edit modal/state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bloodGroup: user?.donorProfile?.bloodGroup || 'O+',
    address: user?.donorProfile?.address || '',
    city: user?.donorProfile?.city || '',
    state: user?.donorProfile?.state || '',
    pincode: user?.donorProfile?.pincode || '',
    lastDonationDate: user?.donorProfile?.lastDonationDate
      ? user.donorProfile.lastDonationDate.split('T')[0]
      : '',
    isAvailable: user?.donorProfile?.isAvailable ?? true
  });

  const fetchDonorData = async () => {
    try {
      setLoading(true);
      const res = await donorService.getDonorRelevantRequests();
      if (res.success) {
        setRequests(res.data || []);
        setStats(res.stats || { totalReceived: 0, accepted: 0, pending: 0 });
      }
    } catch (error) {
      console.error('Error fetching donor requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorData();
  }, []);

  const handleRespond = async (requestId, responseType) => {
    try {
      setActionLoading(requestId);
      const res = await requestService.respondToRequest(requestId, {
        response: responseType,
        message:
          responseType === 'Accepted'
            ? 'I am willing to donate blood. Please connect with hospital coordinates.'
            : 'Unable to donate at this time.'
      });

      if (res.success) {
        setFeedbackMsg({
          type: 'success',
          text: `You have successfully ${responseType.toLowerCase()} the request.`
        });
        await fetchDonorData();
      }
    } catch (error) {
      console.error('Error responding to request:', error);
      setFeedbackMsg({
        type: 'error',
        text: error.response?.data?.message || 'Failed to submit response.'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!user?.donorProfile?._id) return;

    try {
      setActionLoading('profile');
      const res = await donorService.updateProfile(user.donorProfile._id, profileForm);
      if (res.success) {
        setFeedbackMsg({ type: 'success', text: 'Donor profile updated successfully!' });
        setIsEditingProfile(false);
        // Refresh local user state
        const updatedUser = {
          ...user,
          name: profileForm.name,
          phone: profileForm.phone,
          donorProfile: res.data
        };
        updateCurrentUser(updatedUser);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setFeedbackMsg({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile.'
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout
      title="Donor Control Center"
      subtitle={`Welcome back, ${user?.name}. Track matching emergency transfusion requests.`}
    >
      {/* Toast Alert */}
      {feedbackMsg.text && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center justify-between text-xs font-semibold ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button
            onClick={() => setFeedbackMsg({ type: '', text: '' })}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Received Requests
            </p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{stats.totalReceived}</p>
            <p className="text-[11px] text-slate-400 mt-1">Matching your blood group</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <Droplet className="w-6 h-6 fill-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Accepted Requests
            </p>
            <p className="text-3xl font-extrabold text-emerald-600 mt-1">{stats.accepted}</p>
            <p className="text-[11px] text-slate-400 mt-1">Confirmed by you</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Awaiting Action
            </p>
            <p className="text-3xl font-extrabold text-amber-600 mt-1">{stats.pending}</p>
            <p className="text-[11px] text-slate-400 mt-1">Urgent response needed</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Donor Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-red-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-red-200">
              {user?.donorProfile?.bloodGroup || 'O+'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{user?.name}</h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    user?.donorProfile?.isAvailable
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user?.donorProfile?.isAvailable ? 'Available to Donate' : 'Currently Unavailable'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {user?.donorProfile?.city}, {user?.donorProfile?.state} ({user?.donorProfile?.pincode})
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition self-start sm:self-auto"
          >
            <Edit className="w-3.5 h-3.5 text-slate-500" />
            {isEditingProfile ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>

        {/* View Profile Mode */}
        {!isEditingProfile ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Contact Phone:</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">{user?.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Email Address:</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">{user?.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Last Donation:</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {user?.donorProfile?.lastDonationDate
                  ? formatDate(user.donorProfile.lastDonationDate)
                  : 'Eligible (None recorded)'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Residential Locality:</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {user?.donorProfile?.address || 'Provided'}
              </span>
            </div>
          </div>
        ) : (
          /* Edit Profile Form */
          <form onSubmit={handleProfileUpdate} className="pt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={profileForm.bloodGroup}
                  onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                <input
                  type="text"
                  value={profileForm.state}
                  onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
                <input
                  type="text"
                  value={profileForm.pincode}
                  onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Last Blood Donation Date</label>
                <input
                  type="date"
                  value={profileForm.lastDonationDate}
                  onChange={(e) => setProfileForm({ ...profileForm, lastDonationDate: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isAvailableEdit"
                checked={profileForm.isAvailable}
                onChange={(e) => setProfileForm({ ...profileForm, isAvailable: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded"
              />
              <label htmlFor="isAvailableEdit" className="text-xs font-semibold text-slate-700 cursor-pointer">
                Available to receive emergency blood requests
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 border border-slate-300 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading === 'profile'}
                className="px-5 py-2 bg-red-600 text-white text-xs font-semibold rounded-xl hover:bg-red-700 flex items-center gap-1.5 shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                {actionLoading === 'profile' ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Matching / Received Blood Requests */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Matching Blood Transfusion Requests
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Requests compatible with your blood type ({user?.donorProfile?.bloodGroup || 'Your Group'})
            </p>
          </div>
          <button
            onClick={fetchDonorData}
            className="text-xs text-red-600 font-semibold hover:underline self-start sm:self-auto"
          >
            Refresh Requests
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500 mt-3">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">No pending blood requests right now</p>
            <p className="text-xs text-slate-400 mt-1">
              You will see emergency alerts here whenever a patient needs your blood type.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {requests.map((reqItem) => (
              <div key={reqItem._id} className="p-6 hover:bg-slate-50/70 transition">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Details */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-sm px-2.5 py-0.5 bg-red-600 text-white rounded-lg">
                        {reqItem.bloodGroup}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getPriorityBadgeClass(
                          reqItem.priority
                        )}`}
                      >
                        {reqItem.priority}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusBadgeClass(
                          reqItem.status
                        )}`}
                      >
                        Status: {reqItem.status}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Req ID: #{reqItem._id.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">
                      Patient: {reqItem.patientName}{' '}
                      <span className="text-xs font-normal text-slate-500">
                        ({reqItem.unitsRequired} Unit{reqItem.unitsRequired > 1 ? 's' : ''} needed)
                      </span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Hospital className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-800">{reqItem.hospitalName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {reqItem.city}, {reqItem.state} ({reqItem.pincode})
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Required by: {formatDate(reqItem.requiredDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Contact: {reqItem.contactNumber}</span>
                      </div>
                    </div>

                    {reqItem.additionalNotes && (
                      <p className="text-xs text-slate-500 italic bg-slate-100 p-2 rounded-lg mt-2">
                        "{reqItem.additionalNotes}"
                      </p>
                    )}
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-end gap-2.5 shrink-0">
                    {reqItem.myResponse ? (
                      <div className="text-right">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1 ${
                            reqItem.myResponse === 'Accepted'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {reqItem.myResponse === 'Accepted' ? (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-slate-500" />
                          )}
                          You {reqItem.myResponse} this request
                        </span>
                        {reqItem.myRespondedAt && (
                          <p className="text-[10px] text-slate-400 mt-1">
                            Responded on {formatDate(reqItem.myRespondedAt)}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleRespond(reqItem._id, 'Rejected')}
                          disabled={actionLoading === reqItem._id}
                          className="px-3.5 py-2 border border-slate-300 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          Decline
                        </button>
                        <button
                          onClick={() => handleRespond(reqItem._id, 'Accepted')}
                          disabled={actionLoading === reqItem._id}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Accept & Donate
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DonorDashboard;
