import { useEffect, useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  Car,
  Loader2,
  Pencil,
  Award,
  CalendarCheck,
} from 'lucide-react';
import {
  updateCustomer,
  getApiErrorMessage,
  formatCurrency,
} from '../services/customerService';
import {
  carTypes,
  inputClass,
  labelClass,
  customerToForm,
} from '../data/customerFormOptions';

export default function EditCustomerModal({ isOpen, customer, onClose, onSuccess }) {
  const [form, setForm] = useState(customerToForm(customer));
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && customer) {
      setForm(customerToForm(customer));
      setError('');
    }
  }, [isOpen, customer]);

  if (!isOpen || !customer) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.fullName.trim()) {
      setError('Please enter customer name.');
      return;
    }
    if (!form.phoneNumber.trim()) {
      setError('Please enter phone number.');
      return;
    }
    if (!form.licensePlate.trim()) {
      setError('Please enter license plate.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await updateCustomer(customer.id, {
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        email: form.email.trim() || undefined,
        licensePlate: form.licensePlate.trim().toUpperCase(),
        carType: form.carType,
      });

      onSuccess?.(updated);
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to update customer. Please try again.'));
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
        <div className="h-1.5 bg-gradient-to-r from-[#6366f1] via-[#0047AB] to-[#0ea5e9]" />

        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-xl ${customer.avatarBg} flex items-center justify-center text-white text-sm font-bold shrink-0`}
            >
              {customer.initials}
            </div>
            <div>
              <h2 className="text-[#181c1e] text-xl font-bold">Edit Customer</h2>
              <p className="text-[#848a9c] text-sm mt-1">{customer.name}</p>
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

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-[#f7fafd] border border-gray-100 p-3">
              <div className="flex items-center gap-2 text-[#848a9c] text-xs mb-1">
                <Award className="w-3.5 h-3.5" />
                Membership Tier
              </div>
              <p className="text-sm font-semibold text-[#181c1e]">{customer.membership}</p>
            </div>
            <div className="rounded-xl bg-[#f7fafd] border border-gray-100 p-3">
              <div className="flex items-center gap-2 text-[#848a9c] text-xs mb-1">
                <CalendarCheck className="w-3.5 h-3.5" />
                Total Spending
              </div>
              <p className="text-sm font-semibold text-[#0047AB]">
                {formatCurrency(customer.totalSpending)}
              </p>
            </div>
            <div className="rounded-xl bg-[#f7fafd] border border-gray-100 p-3">
              <p className="text-[#848a9c] text-xs mb-1">Visits</p>
              <p className="text-sm font-semibold text-[#181c1e]">{customer.visits}</p>
            </div>
            <div className="rounded-xl bg-[#f7fafd] border border-gray-100 p-3">
              <p className="text-[#848a9c] text-xs mb-1">Loyalty Points</p>
              <p className="text-sm font-semibold text-[#181c1e]">
                {customer.points.toLocaleString('en-US')}
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="editFullName" className={labelClass}>
              <span className="inline-flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Full Name *
              </span>
            </label>
            <input
              id="editFullName"
              type="text"
              required
              value={form.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="editPhone" className={labelClass}>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  Phone Number *
                </span>
              </label>
              <input
                id="editPhone"
                type="tel"
                required
                value={form.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="editEmail" className={labelClass}>
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </span>
              </label>
              <input
                id="editEmail"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="editPlate" className={labelClass}>
                <span className="inline-flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5" />
                  License Plate *
                </span>
              </label>
              <input
                id="editPlate"
                type="text"
                required
                value={form.licensePlate}
                onChange={(e) => handleChange('licensePlate', e.target.value.toUpperCase())}
                className={`${inputClass} font-mono uppercase`}
              />
            </div>
            <div>
              <label htmlFor="editCarType" className={labelClass}>
                Vehicle Type
              </label>
              <select
                id="editCarType"
                value={form.carType}
                onChange={(e) => handleChange('carType', e.target.value)}
                className={inputClass}
              >
                {carTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
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
                  Saving...
                </>
              ) : (
                <>
                  <Pencil className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
