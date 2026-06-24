import { useEffect, useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  KeyRound,
  AtSign,
  Shield,
  Loader2,
  UserPlus,
} from 'lucide-react';
import { createStaff, getApiErrorMessage } from '../services/staffService';
import { fetchRoles } from '../services/roleService';
import {
  emptyCreateStaffForm,
  inputClass,
  labelClass,
} from '../data/staffFormOptions';

export default function CreateStaffModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState(emptyCreateStaffForm());
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setForm(emptyCreateStaffForm());
    setError('');

    const loadRoles = async () => {
      setIsLoadingRoles(true);
      try {
        const data = await fetchRoles();
        setRoles(data);
      } catch {
        setRoles([]);
      } finally {
        setIsLoadingRoles(false);
      }
    };

    loadRoles();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleRole = (roleId) => {
    setForm((prev) => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter((id) => id !== roleId)
        : [...prev.roleIds, roleId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.fullName.trim()) {
      setError('Please enter full name.');
      return;
    }
    if (!form.username.trim()) {
      setError('Please enter username.');
      return;
    }
    if (!form.password.trim()) {
      setError('Please enter initial password.');
      return;
    }
    if (form.roleIds.length === 0) {
      setError('Please select at least one role.');
      return;
    }

    setIsSubmitting(true);
    try {
      const staff = await createStaff({
        fullName: form.fullName.trim(),
        username: form.username.trim(),
        email: form.email.trim() || undefined,
        phoneNumber: form.phoneNumber.trim() || undefined,
        password: form.password,
        roleIds: form.roleIds,
      });

      onSuccess?.(staff);
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to create staff account.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-[0_24px_60px_rgba(0,71,171,0.18)] border border-gray-200">
        <div className="h-1.5 bg-gradient-to-r from-[#0047AB] via-[#6366f1] to-[#0ea5e9]" />

        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E6F0FF] flex items-center justify-center shrink-0">
              <UserPlus className="w-6 h-6 text-[#0047AB]" />
            </div>
            <div>
              <h2 className="text-[#181c1e] text-xl font-bold">Onboard Staff</h2>
              <p className="text-[#848a9c] text-sm mt-1">Create a new staff account for the system.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-[#434654]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="staffFullName" className={labelClass}>
              <span className="inline-flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Full Name *
              </span>
            </label>
            <input
              id="staffFullName"
              type="text"
              required
              value={form.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="staffUsername" className={labelClass}>
                <span className="inline-flex items-center gap-1.5">
                  <AtSign className="w-3.5 h-3.5" />
                  Username *
                </span>
              </label>
              <input
                id="staffUsername"
                type="text"
                required
                value={form.username}
                onChange={(e) => handleChange('username', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="staffPassword" className={labelClass}>
                <span className="inline-flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" />
                  Password *
                </span>
              </label>
              <input
                id="staffPassword"
                type="password"
                required
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="staffPhone" className={labelClass}>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  Phone Number
                </span>
              </label>
              <input
                id="staffPhone"
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="staffEmail" className={labelClass}>
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </span>
              </label>
              <input
                id="staffEmail"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>
              <span className="inline-flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Roles *
              </span>
            </label>
            {isLoadingRoles ? (
              <p className="text-sm text-[#848a9c]">Loading roles...</p>
            ) : roles.length === 0 ? (
              <p className="text-sm text-[#848a9c]">No roles available.</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-40 overflow-y-auto border border-gray-100 rounded-lg p-3">
                {roles.map((role) => (
                  <label
                    key={role.id}
                    className="flex items-center gap-2 text-sm text-[#434654] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form.roleIds.includes(role.id)}
                      onChange={() => toggleRole(role.id)}
                      className="rounded border-gray-300 text-[#0047AB] focus:ring-[#0047AB]"
                    />
                    <span className="font-medium">{role.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-[#434654] border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold rounded-lg disabled:opacity-60 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Staff
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
