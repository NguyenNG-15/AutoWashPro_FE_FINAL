import { useEffect, useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  AtSign,
  Shield,
  Loader2,
  Settings,
  KeyRound,
  Lock,
  Unlock,
  Save,
} from 'lucide-react';
import {
  assignStaffRoles,
  fetchStaffById,
  getApiErrorMessage,
  resetStaffPassword,
  updateStaff,
  updateStaffAccountStatus,
  updateStaffWorkStatus,
  deleteStaff,
  resendStaffActivation,
  restoreStaff,
} from '../services/staffService';
import { fetchRoles } from '../services/roleService';
import {
  accountStatusOptions,
  inputClass,
  labelClass,
  staffToProfileForm,
  workStatusOptions,
} from '../data/staffFormOptions';

export default function StaffManageModal({ isOpen, staffId, onClose, onSuccess }) {
  const [staff, setStaff] = useState(null);
  const [profileForm, setProfileForm] = useState(staffToProfileForm());
  const [workStatus, setWorkStatus] = useState('IDLE');
  const [accountStatus, setAccountStatus] = useState('ACTIVE');
  const [roleIds, setRoleIds] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingWorkStatus, setIsSavingWorkStatus] = useState(false);
  const [isSavingAccountStatus, setIsSavingAccountStatus] = useState(false);
  const [isSavingRoles, setIsSavingRoles] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    if (!isOpen || !staffId) return undefined;

    setError('');
    setInfo('');
    setNewPassword('');

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [detail, roleList] = await Promise.all([fetchStaffById(staffId), fetchRoles()]);
        setStaff(detail);
        setProfileForm(staffToProfileForm(detail));
        setWorkStatus(detail.workStatus);
        setAccountStatus(detail.accountStatus);
        setRoleIds(detail.roleIds ?? []);
        setRoles(roleList);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to load staff details.'));
        setStaff(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isOpen, staffId]);

  if (!isOpen) return null;

  const notifySuccess = (message, updatedStaff) => {
    setInfo(message);
    setError('');
    if (updatedStaff) setStaff(updatedStaff);
    onSuccess?.(updatedStaff);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setError('');
    setInfo('');

    try {
      const updated = await updateStaff(staffId, {
        fullName: profileForm.fullName.trim(),
        username: profileForm.username.trim(),
        email: profileForm.email.trim() || undefined,
        phoneNumber: profileForm.phoneNumber.trim() || undefined,
      });
      setProfileForm(staffToProfileForm(updated));
      notifySuccess('Staff profile updated successfully.', updated);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to update profile.'));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveWorkStatus = async () => {
    setIsSavingWorkStatus(true);
    setError('');
    setInfo('');

    try {
      const updated = await updateStaffWorkStatus(staffId, workStatus);
      setWorkStatus(updated.workStatus);
      notifySuccess('Shift status updated successfully.', updated);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to update shift status.'));
    } finally {
      setIsSavingWorkStatus(false);
    }
  };

  const handleToggleAccountStatus = async () => {
    const nextStatus = accountStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setIsSavingAccountStatus(true);
    setError('');
    setInfo('');

    try {
      const updated = await updateStaffAccountStatus(staffId, nextStatus);
      setAccountStatus(updated.accountStatus);
      notifySuccess(
        nextStatus === 'ACTIVE' ? 'Account unlocked successfully.' : 'Account locked successfully.',
        updated,
      );
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to change account status.'));
    } finally {
      setIsSavingAccountStatus(false);
    }
  };

  const toggleRole = (roleId) => {
    setRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId],
    );
  };

  const handleSaveRoles = async () => {
    if (roleIds.length === 0) {
      setError('Please select at least one role.');
      return;
    }

    setIsSavingRoles(true);
    setError('');
    setInfo('');

    try {
      const updated = await assignStaffRoles(staffId, roleIds);
      setRoleIds(updated.roleIds ?? roleIds);
      notifySuccess('Roles assigned successfully.', updated);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to assign roles.'));
    } finally {
      setIsSavingRoles(false);
    }
  };

  const handleResetPassword = async () => {
    setIsResettingPassword(true);
    setError('');
    setInfo('');

    try {
      const result = await resetStaffPassword(
        staffId,
        newPassword.trim() ? { newPassword: newPassword.trim() } : {},
      );
      const tempPassword = result?.newPassword ?? result?.temporaryPassword ?? result?.password;
      notifySuccess(
        tempPassword
          ? `Password reset. New password: ${tempPassword}`
          : 'Staff password reset successfully.',
      );
      setNewPassword('');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to reset password.'));
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleResendActivation = async () => {
    setIsResending(true);
    setError('');
    setInfo('');
    try {
      await resendStaffActivation(staffId);
      notifySuccess('Activation email has been resent successfully.');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to resend activation email.'));
    } finally {
      setIsResending(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${staff.name}?`)) return;
    setIsDeleting(true);
    setError('');
    setInfo('');
    try {
      await deleteStaff(staffId);
      const updated = await fetchStaffById(staffId);
      notifySuccess('Staff deleted successfully.', updated);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to delete staff.'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    setError('');
    setInfo('');
    try {
      const updated = await restoreStaff(staffId);
      notifySuccess('Staff restored successfully.', updated);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to restore staff.'));
    } finally {
      setIsRestoring(false);
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

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-[0_24px_60px_rgba(0,71,171,0.18)] border border-gray-200">
        <div className="h-1.5 bg-gradient-to-r from-[#6366f1] via-[#0047AB] to-[#0ea5e9]" />

        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {staff ? (
              <div
                className={`w-12 h-12 rounded-xl ${staff.avatarBg} flex items-center justify-center text-white text-sm font-bold shrink-0`}
              >
                {staff.initials}
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-[#E6F0FF] flex items-center justify-center shrink-0">
                <Settings className="w-6 h-6 text-[#0047AB]" />
              </div>
            )}
            <div>
              <h2 className="text-[#181c1e] text-xl font-bold">Manage Staff</h2>
              <p className="text-[#848a9c] text-sm mt-1">
                {staff ? staff.name : 'Loading details...'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-[#434654]" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {info && (
            <div className="rounded-lg border border-[#16a34a]/30 bg-[#f0fdf4] px-4 py-3 text-sm text-[#16a34a]">
              {info}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-[#848a9c]">
              <Loader2 className="w-5 h-5 animate-spin text-[#0047AB]" />
              <span className="text-sm">Loading staff details...</span>
            </div>
          ) : staff ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl bg-[#f7fafd] border border-gray-100 p-3">
                  <p className="text-[#848a9c] text-xs mb-1">Jobs</p>
                  <p className="text-sm font-semibold text-[#181c1e]">{staff.jobs}</p>
                </div>
                <div className="rounded-xl bg-[#f7fafd] border border-gray-100 p-3">
                  <p className="text-[#848a9c] text-xs mb-1">Efficiency</p>
                  <p className="text-sm font-semibold text-[#0047AB]">{staff.efficiency}%</p>
                </div>
                <div className="rounded-xl bg-[#f7fafd] border border-gray-100 p-3">
                  <p className="text-[#848a9c] text-xs mb-1">Rating</p>
                  <p className="text-sm font-semibold text-[#181c1e]">
                    {staff.rating > 0 ? staff.rating : '—'}
                  </p>
                </div>
                <div className="rounded-xl bg-[#f7fafd] border border-gray-100 p-3">
                  <p className="text-[#848a9c] text-xs mb-1">Role</p>
                  <p className="text-sm font-semibold text-[#181c1e] truncate">{staff.role}</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="rounded-xl border border-gray-100 p-5 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-[#181c1e]">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="editStaffName" className={labelClass}>
                      <span className="inline-flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        Full Name
                      </span>
                    </label>
                    <input
                      id="editStaffName"
                      type="text"
                      value={profileForm.fullName}
                      onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, fullName: e.target.value }))
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="editStaffUsername" className={labelClass}>
                      <span className="inline-flex items-center gap-1.5">
                        <AtSign className="w-3.5 h-3.5" />
                        Username
                      </span>
                    </label>
                    <input
                      id="editStaffUsername"
                      type="text"
                      value={profileForm.username}
                      onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, username: e.target.value }))
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="editStaffPhone" className={labelClass}>
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        Phone Number
                      </span>
                    </label>
                    <input
                      id="editStaffPhone"
                      type="tel"
                      value={profileForm.phoneNumber}
                      onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="editStaffEmail" className={labelClass}>
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        Email
                      </span>
                    </label>
                    <input
                      id="editStaffEmail"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-4 py-2 bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold rounded-lg disabled:opacity-60 flex items-center gap-2"
                  >
                    {isSavingProfile ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Profile
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-100 p-5 flex flex-col gap-3">
                  <h3 className="text-sm font-bold text-[#181c1e]">Shift Status</h3>
                  <select
                    value={workStatus}
                    onChange={(e) => setWorkStatus(e.target.value)}
                    className={inputClass}
                  >
                    {workStatusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleSaveWorkStatus}
                    disabled={isSavingWorkStatus}
                    className="px-4 py-2 border border-[#0047AB]/20 text-[#0047AB] text-sm font-semibold rounded-lg hover:bg-[#E6F0FF] disabled:opacity-60"
                  >
                    {isSavingWorkStatus ? 'Saving...' : 'Update Shift'}
                  </button>
                </div>

                <div className="rounded-xl border border-gray-100 p-5 flex flex-col gap-3">
                  <h3 className="text-sm font-bold text-[#181c1e]">Account</h3>
                  <span
                    className={`inline-flex w-fit text-xs font-semibold px-2.5 py-1 rounded-full ${staff.accountStatusClass}`}
                  >
                    {staff.accountStatusLabel}
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleAccountStatus}
                    disabled={isSavingAccountStatus}
                    className="px-4 py-2 border border-gray-200 text-sm font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-60 flex items-center gap-2"
                  >
                    {accountStatus === 'ACTIVE' ? (
                      <>
                        <Lock className="w-4 h-4 text-[#dc2626]" />
                        Lock Account
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4 text-[#16a34a]" />
                        Unlock Account
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 p-5 flex flex-col gap-3">
                <h3 className="text-sm font-bold text-[#181c1e] flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Assign Roles
                </h3>
                <div className="flex flex-col gap-2 max-h-36 overflow-y-auto">
                  {roles.map((role) => (
                    <label
                      key={role.id}
                      className="flex items-center gap-2 text-sm text-[#434654] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={roleIds.includes(role.id)}
                        onChange={() => toggleRole(role.id)}
                        className="rounded border-gray-300 text-[#0047AB] focus:ring-[#0047AB]"
                      />
                      <span className="font-medium">{role.name}</span>
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleSaveRoles}
                  disabled={isSavingRoles}
                  className="self-start px-4 py-2 border border-[#0047AB]/20 text-[#0047AB] text-sm font-semibold rounded-lg hover:bg-[#E6F0FF] disabled:opacity-60"
                >
                  {isSavingRoles ? 'Saving...' : 'Save Roles'}
                </button>
              </div>

              <div className="rounded-xl border border-gray-100 p-5 flex flex-col gap-3">
                <h3 className="text-sm font-bold text-[#181c1e] flex items-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  Reset Password
                </h3>
                <p className="text-xs text-[#848a9c]">
                  Leave blank to let the system generate a new password.
                </p>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (optional)"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={isResettingPassword}
                  className="self-start px-4 py-2 bg-[#fff7ed] text-[#ea580c] border border-[#ea580c]/20 text-sm font-semibold rounded-lg hover:bg-[#ffedd5] disabled:opacity-60"
                >
                  {isResettingPassword ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>

              {/* Danger Zone */}
              <div className="rounded-xl border border-red-100 bg-red-50/30 p-5 flex flex-col gap-3 mt-4">
                <h3 className="text-sm font-bold text-red-600 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Danger Zone
                </h3>
                <p className="text-xs text-red-500 mb-2">
                  These actions can have irreversible effects on this staff member's account.
                </p>
                <div className="flex flex-wrap gap-3">
                  {staff.accountStatus === 'PENDING_ACTIVATION' && (
                    <button
                      type="button"
                      onClick={handleResendActivation}
                      disabled={isResending}
                      className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 disabled:opacity-60"
                    >
                      {isResending ? 'Sending...' : 'Resend Activation Email'}
                    </button>
                  )}
                  {staff.accountStatus === 'DELETED' ? (
                    <button
                      type="button"
                      onClick={handleRestore}
                      disabled={isRestoring}
                      className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-60"
                    >
                      {isRestoring ? 'Restoring...' : 'Restore Staff'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-60"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Staff'}
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
