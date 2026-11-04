import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { adminService, donorService, requestService } from '../services/api';
import {
  Users,
  Droplet,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Eye,
  Activity,
  BarChart3,
  ShieldCheck,
  Check,
  X,
  Hospital
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import { formatDate, getPriorityBadgeClass, getStatusBadgeClass } from '../utils/compatibility';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'users', 'donors', 'requests'
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Users tab state
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');

  // Donors tab state
  const [donors, setDonors] = useState([]);
  const [donorSearch, setDonorSearch] = useState('');
  const [donorGroupFilter, setDonorGroupFilter] = useState('');

  // Requests tab state
  const [requests, setRequests] = useState([]);
  const [requestSearch, setRequestSearch] = useState('');
  const [requestPriorityFilter, setRequestPriorityFilter] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState('');

  // Selected item for detail view modal
  const [modalItem, setModalItem] = useState(null);
  const [modalType, setModalType] = useState(null); // 'donor', 'user', 'request'
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboardStats();
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
    } catch (error) {
      console.error('Error fetching admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers({
        search: userSearch,
        role: userRoleFilter
      });
      if (res.success) setUsers(res.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchDonors = async () => {
    try {
      const res = await adminService.getDonors({
        search: donorSearch,
        bloodGroup: donorGroupFilter
      });
      if (res.success) setDonors(res.data || []);
    } catch (error) {
      console.error('Error fetching donors:', error);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await adminService.getRequests({
        search: requestSearch,
        priority: requestPriorityFilter,
        status: requestStatusFilter
      });
      if (res.success) setRequests(res.data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'donors') fetchDonors();
    if (activeTab === 'requests') fetchRequests();
  }, [
    activeTab,
    userSearch,
    userRoleFilter,
    donorSearch,
    donorGroupFilter,
    requestSearch,
    requestPriorityFilter,
    requestStatusFilter
  ]);

  // Admin user toggle status
  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      setActionLoading(true);
      const res = await adminService.toggleUserStatus(userId, !currentStatus);
      if (res.success) {
        setFeedback({ type: 'success', text: res.message });
        fetchUsers();
        fetchDashboard();
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update user status'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Admin donor delete
  const handleDeleteDonor = async (donorId) => {
    if (!window.confirm('Are you sure you want to delete this donor profile?')) return;
    try {
      setActionLoading(true);
      const res = await donorService.deleteDonor(donorId);
      if (res.success) {
        setFeedback({ type: 'success', text: 'Donor record deleted successfully.' });
        fetchDonors();
        fetchDashboard();
        if (modalItem?._id === donorId) setModalItem(null);
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete donor.'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Admin request status update
  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      setActionLoading(true);
      const res = await requestService.updateStatus(requestId, newStatus);
      if (res.success) {
        setFeedback({ type: 'success', text: `Request status updated to ${newStatus}` });
        fetchRequests();
        fetchDashboard();
        if (modalItem?._id === requestId) {
          setModalItem({ ...modalItem, status: newStatus });
        }
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update request status'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const stats = dashboardData?.stats || {
    totalUsers: 0,
    totalDonors: 0,
    availableDonors: 0,
    totalRequests: 0,
    pendingRequests: 0,
    emergencyRequests: 0,
    fulfilledRequests: 0
  };

  const analytics = dashboardData?.analytics || {
    requestsByBloodGroup: [],
    monthlyRequests: [],
    donorAvailability: [],
    statusDistribution: []
  };

  return (
    <DashboardLayout
      title="Administrator Operations Console"
      subtitle="Complete management, oversight, and analytics across BloodConnect."
    >
      {/* Toast Alert */}
      {feedback.text && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center justify-between text-xs font-semibold ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <span>{feedback.text}</span>
          <button
            onClick={() => setFeedback({ type: '', text: '' })}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary KPI Statistic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Users
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{stats.totalUsers}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Donors
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{stats.totalDonors}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Available
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-1">
            {stats.availableDonors}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Requests
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            {stats.totalRequests}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Pending
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-amber-600 mt-1">
            {stats.pendingRequests}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Emergency
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-red-600 mt-1">
            {stats.emergencyRequests}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Fulfilled
          </span>
          <p className="text-xl sm:text-2xl font-extrabold text-blue-600 mt-1">
            {stats.fulfilledRequests}
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 mb-8 space-x-1 sm:space-x-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-3 px-4 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Analytics & Charts
        </button>
        <button
          onClick={() => setActiveTab('donors')}
          className={`py-3 px-4 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'donors'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Droplet className="w-4 h-4" />
          Donor Management ({stats.totalDonors})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`py-3 px-4 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Blood Requests ({stats.totalRequests})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-3 px-4 border-b-2 font-bold text-xs sm:text-sm whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          User Management ({stats.totalUsers})
        </button>
      </div>

      {/* TAB 1: ANALYTICS & RECHARTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Blood Requests by Blood Group */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                1. Demand & Donor Supply by Blood Group
              </h4>
              <p className="text-xs text-slate-500 mb-6">
                Comparison of requests created vs registered donors available
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.requestsByBloodGroup}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="bloodGroup" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="requests" name="Blood Requests" fill="#DC2626" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="donors" name="Registered Donors" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Monthly Blood Requests */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                2. Monthly Blood Requests Trend
              </h4>
              <p className="text-xs text-slate-500 mb-6">
                Transfusion activity trajectory over recent months
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.monthlyRequests}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="requests"
                      name="Requests"
                      stroke="#DC2626"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 3: Donor Availability Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                3. Donor Availability Distribution
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Current active vs resting donor status
              </p>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.donorAvailability}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {analytics.donorAvailability.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Request Status Distribution */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                4. Request Status Pipeline
              </h4>
              <p className="text-xs text-slate-500 mb-6">
                Breakdown of active requests by completion status
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.statusDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                    <YAxis dataKey="status" type="category" tick={{ fontSize: 11 }} width={90} />
                    <Tooltip />
                    <Bar dataKey="count" name="Count" fill="#10B981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DONOR MANAGEMENT */}
      {activeTab === 'donors' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Filters Bar */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={donorSearch}
                onChange={(e) => setDonorSearch(e.target.value)}
                placeholder="Search donors by name, city..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={donorGroupFilter}
                onChange={(e) => setDonorGroupFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="">All Blood Groups</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Donor Name</th>
                  <th className="px-6 py-3.5">Blood Group</th>
                  <th className="px-6 py-3.5">Contact / Email</th>
                  <th className="px-6 py-3.5">Location</th>
                  <th className="px-6 py-3.5">Availability</th>
                  <th className="px-6 py-3.5">Last Donated</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {donors.map((donor) => (
                  <tr key={donor._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{donor.userId?.name || 'Donor'}</div>
                      <div className="text-[10px] text-slate-400">
                        Joined {formatDate(donor.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-xs px-2.5 py-1 bg-red-100 text-red-700 rounded-lg">
                        {donor.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{donor.userId?.phone}</div>
                      <div className="text-[11px] text-slate-400">{donor.userId?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        {donor.city}, {donor.state}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{donor.pincode}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          donor.isAvailable
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {donor.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {donor.lastDonationDate ? formatDate(donor.lastDonationDate) : 'None recorded'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setModalItem(donor);
                          setModalType('donor');
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteDonor(donor._id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete donor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BLOOD REQUEST MANAGEMENT */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Filter Bar */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={requestSearch}
                onChange={(e) => setRequestSearch(e.target.value)}
                placeholder="Search patient, hospital, city..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={requestPriorityFilter}
                onChange={(e) => setRequestPriorityFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="">All Priorities</option>
                <option value="Emergency">Emergency</option>
                <option value="Urgent">Urgent</option>
                <option value="Normal">Normal</option>
              </select>

              <select
                value={requestStatusFilter}
                onChange={(e) => setRequestStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Donor Found">Donor Found</option>
                <option value="Fulfilled">Fulfilled</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Patient / Req ID</th>
                  <th className="px-6 py-3.5">Blood Group</th>
                  <th className="px-6 py-3.5">Hospital</th>
                  <th className="px-6 py-3.5">Priority</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Change Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {requests.map((reqItem) => (
                  <tr key={reqItem._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{reqItem.patientName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        #{reqItem._id.slice(-6).toUpperCase()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-extrabold text-xs px-2.5 py-1 bg-red-100 text-red-700 rounded-lg">
                        {reqItem.bloodGroup}
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1.5">
                        ({reqItem.unitsRequired} Units)
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
                      <select
                        value={reqItem.status}
                        onChange={(e) => handleUpdateStatus(reqItem._id, e.target.value)}
                        className="px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Donor Found">Donor Found</option>
                        <option value="Fulfilled">Fulfilled</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setModalItem(reqItem);
                          setModalType('request');
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Filter Bar */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users by name, email..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="">All Roles</option>
                <option value="donor">Donor</option>
                <option value="recipient">Recipient</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">User Full Name</th>
                  <th className="px-6 py-3.5">Email Address</th>
                  <th className="px-6 py-3.5">Phone Number</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Account Status</th>
                  <th className="px-6 py-3.5 text-right">Toggle Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((usr) => (
                  <tr key={usr._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-4 font-bold text-slate-900">{usr.name}</td>
                    <td className="px-6 py-4 text-slate-600">{usr.email}</td>
                    <td className="px-6 py-4 text-slate-600">{usr.phone}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        {usr.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          usr.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {usr.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {usr.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleUserStatus(usr._id, usr.isActive)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                            usr.isActive
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {usr.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Item Modal */}
      {modalItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {modalType === 'donor' && 'Donor Detailed Profile'}
                {modalType === 'request' && 'Blood Request Inspection'}
              </h3>
              <button
                onClick={() => setModalItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalType === 'donor' && (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Donor Name:</span>
                  <span className="font-bold text-slate-900">{modalItem.userId?.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Blood Group:</span>
                  <span className="font-extrabold text-red-600">{modalItem.bloodGroup}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Contact:</span>
                  <span className="font-bold text-slate-900">{modalItem.userId?.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Residential Address:</span>
                  <span className="font-medium text-slate-900 text-right">{modalItem.address}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-medium text-slate-900">
                    {modalItem.city}, {modalItem.state} ({modalItem.pincode})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Date of Birth:</span>
                  <span className="font-medium text-slate-900">{formatDate(modalItem.dateOfBirth)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Last Blood Donation:</span>
                  <span className="font-medium text-slate-900">
                    {modalItem.lastDonationDate ? formatDate(modalItem.lastDonationDate) : 'None'}
                  </span>
                </div>
              </div>
            )}

            {modalType === 'request' && (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Patient Name:</span>
                  <span className="font-bold text-slate-900">{modalItem.patientName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Blood Group & Units:</span>
                  <span className="font-bold text-red-600">
                    {modalItem.bloodGroup} ({modalItem.unitsRequired} Units)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Hospital:</span>
                  <span className="font-bold text-slate-900">{modalItem.hospitalName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-medium text-slate-900">
                    {modalItem.city}, {modalItem.state} ({modalItem.pincode})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Priority:</span>
                  <span className="font-bold text-red-600">{modalItem.priority}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-slate-900">{modalItem.status}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Donor Responses:</span>
                  <span className="font-bold text-slate-900">
                    {modalItem.donorResponses?.length || 0} response(s)
                  </span>
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setModalItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
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

export default AdminDashboard;
