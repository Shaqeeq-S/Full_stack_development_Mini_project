import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { requestService } from '../services/api';
import {
  Droplet,
  Hospital,
  MapPin,
  Calendar,
  AlertTriangle,
  User,
  Phone,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { ALL_BLOOD_GROUPS } from '../utils/compatibility';

const CreateRequest = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    patientName: '',
    contactNumber: user?.phone || '',
    bloodGroup: searchParams.get('bloodGroup') || 'O+',
    unitsRequired: 1,
    hospitalName: '',
    address: '',
    city: searchParams.get('city') || '',
    state: '',
    pincode: '',
    requiredDate: new Date().toISOString().split('T')[0],
    additionalNotes: searchParams.get('donorName')
      ? `Requested via donor search (Direct alert to ${searchParams.get('donorName')})`
      : '',
    isEmergency: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.patientName ||
      !formData.contactNumber ||
      !formData.hospitalName ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      setError('Please fill in all mandatory fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const payload = {
        ...formData,
        priority: formData.isEmergency ? 'Emergency' : 'Normal',
        unitsRequired: Number(formData.unitsRequired)
      };

      const res = await requestService.createRequest(payload);

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/my-requests');
        }, 1500);
      }
    } catch (err) {
      console.error('Request creation error:', err);
      const msg =
        err.response?.data?.message || 'Failed to submit blood request. Please check inputs.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Create Blood Transfusion Request"
      subtitle="Broadcast an emergency or scheduled blood requirement to verified donors."
    >
      <div className="max-w-3xl mx-auto">
        {/* Prominent Emergency Toggle Banner */}
        <div
          className={`p-5 rounded-2xl border transition mb-6 ${
            formData.isEmergency
              ? 'bg-red-50 border-red-300 ring-2 ring-red-500 shadow-md animate-emergency'
              : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  formData.isEmergency ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Is this a Life-Critical Emergency?
                </h4>
                <p className="text-xs text-slate-500">
                  Emergency requests receive top priority flags across donor dashboards.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isEmergency"
                checked={formData.isEmergency}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-red-700 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs font-semibold">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Blood request submitted successfully! Redirecting to My Requests...</span>
          </div>
        )}

        {/* Main Request Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Patient & Blood Requirement */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                1. Patient & Transfusion Requirement
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    required
                    placeholder="Patient name"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Required Blood Group *
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    {ALL_BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Units Required *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    name="unitsRequired"
                    value={formData.unitsRequired}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Contact & Date */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                2. Contact & Schedule
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Attendant Contact Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      required
                      placeholder="+91 9876543210"
                      className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Required by Date *
                  </label>
                  <input
                    type="date"
                    name="requiredDate"
                    value={formData.requiredDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Hospital & Location Details */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                3. Hospital Location & Coordinates
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Hospital Name *
                    </label>
                    <input
                      type="text"
                      name="hospitalName"
                      value={formData.hospitalName}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Apollo Hospital, AIIMS"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Hospital Address / Ward *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Ward 4B, Blood Bank Counter 2"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Bangalore"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Karnataka"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 560038"
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Additional Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Additional Clinical Notes / Instructions
              </label>
              <textarea
                name="additionalNotes"
                rows="3"
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="Mention specific condition, e.g. surgery scheduled, platelet requirement, ICU doctor name, etc."
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || success}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-md transition flex items-center justify-center gap-2 ${
                  formData.isEmergency
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-200'
                    : 'bg-slate-900 hover:bg-slate-800'
                } disabled:opacity-60`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {formData.isEmergency
                        ? 'Broadcast Emergency Request Now'
                        : 'Submit Blood Request'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateRequest;
