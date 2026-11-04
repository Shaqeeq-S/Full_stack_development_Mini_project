import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Upload, Link as LinkIcon, Camera, Check, User, Sparkles } from 'lucide-react';
import Avatar from './Avatar';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80'
];

const AvatarUploadModal = ({ isOpen, onClose, onSaveSuccess }) => {
  const { user, updateUserProfile } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '');
  const [activeMode, setActiveMode] = useState('upload'); // 'upload', 'presets', 'url'
  const [customUrl, setCustomUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Handle local file upload & convert to base64
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file (PNG, JPG, JPEG)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('File size too large (max 2MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedAvatar(reader.result);
      setError('');
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    setSelectedAvatar(customUrl.trim());
    setCustomUrl('');
    setError('');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      await updateUserProfile({ avatar: selectedAvatar });
      if (onSaveSuccess) onSaveSuccess('Profile picture updated successfully!');
      onClose();
    } catch (err) {
      console.error('Failed to update avatar:', err);
      setError(err.response?.data?.message || 'Failed to save profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = async () => {
    setSelectedAvatar('');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Profile Picture</h3>
              <p className="text-xs text-slate-400">Update your avatar across BloodConnect</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Live Preview */}
        <div className="flex flex-col items-center justify-center py-2 space-y-3">
          <Avatar
            src={selectedAvatar}
            name={user?.name}
            size="2xl"
            className="ring-4 ring-red-100 shadow-md"
          />
          <div className="text-center">
            <p className="text-sm font-bold text-slate-900">{user?.name}</p>
            <span className="text-[10px] uppercase font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
              {user?.role}
            </span>
          </div>
          {selectedAvatar && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="text-xs text-red-500 hover:text-red-700 font-semibold"
            >
              Remove photo
            </button>
          )}
        </div>

        {/* Selection Modes */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              activeMode === 'upload' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Upload Image
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('presets')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              activeMode === 'presets' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Choose Preset
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              activeMode === 'url' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Web URL
          </button>
        </div>

        {/* Mode 1: File Upload */}
        {activeMode === 'upload' && (
          <div className="border-2 border-dashed border-slate-200 hover:border-red-400 rounded-2xl p-6 text-center transition cursor-pointer relative bg-slate-50/50">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">Click or drag image to upload</p>
            <p className="text-[11px] text-slate-400 mt-1">PNG, JPG or JPEG up to 2MB</p>
          </div>
        )}

        {/* Mode 2: Presets */}
        {activeMode === 'presets' && (
          <div className="grid grid-cols-4 gap-3">
            {PRESET_AVATARS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedAvatar(preset)}
                className={`relative rounded-xl overflow-hidden border-2 transition hover:scale-105 ${
                  selectedAvatar === preset
                    ? 'border-red-600 ring-2 ring-red-400'
                    : 'border-transparent'
                }`}
              >
                <img src={preset} alt={`Preset ${idx}`} className="w-full h-16 object-cover" />
                {selectedAvatar === preset && (
                  <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center text-white">
                    <Check className="w-4 h-4 font-bold" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Mode 3: Web URL */}
        {activeMode === 'url' && (
          <form onSubmit={handleApplyUrl} className="space-y-3">
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Preview Image URL
            </button>
          </form>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm transition disabled:opacity-60 flex items-center gap-1.5"
          >
            {loading ? 'Saving...' : 'Save Profile Picture'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarUploadModal;
