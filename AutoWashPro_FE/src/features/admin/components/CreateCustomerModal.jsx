import { useEffect, useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  Car,
  Sparkles,
  Loader2,
  UserPlus,
} from 'lucide-react';
import { createCustomer, getApiErrorMessage } from '../services/customerService';
import {
  carTypes,
  emptyCustomerForm,
  inputClass,
  labelClass,
} from '../data/customerFormOptions';

export default function CreateCustomerModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState(emptyCustomerForm());
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm(emptyCustomerForm());
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
      const customer = await createCustomer({
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        email: form.email.trim() || undefined,
        licensePlate: form.licensePlate.trim().toUpperCase(),
        carType: form.carType,
      });

      onSuccess?.(customer);
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to create customer. Please try again.'));
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

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-[0_24px_60px_rgba(0,71,171,0.18)] border border-gray-200 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-[#0047AB] via-[#6366f1] to-[#0ea5e9]" />

        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E6F0FF] flex items-center justify-center shrink-0">
              <UserPlus className="w-6 h-6 text-[#0047AB]" />
            </div>
            <div>
              <h2 className="text-[#181c1e] text-xl font-bold">Add Customer</h2>
              <p className="text-[#848a9c] text-sm mt-1">
                Create a new customer profile for loyalty and booking.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-[#434654]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="rounded-xl bg-[#f7fafd] border border-gray-100 p-4 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#0047AB] shrink-0 mt-0.5" />
            <p className="text-xs text-[#434654] leading-relaxed">
              New customers are assigned the default <strong>Member</strong> tier. Loyalty points
              and visit count are tracked automatically after the first wash.
            </p>
          </div>

          <div>
            <label htmlFor="fullName" className={labelClass}>
              <span className="inline-flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Full Name *
              </span>
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={form.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="John Doe"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phoneNumber" className={labelClass}>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  Phone Number *
                </span>
              </label>
              <input
                id="phoneNumber"
                type="tel"
                required
                value={form.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                placeholder="0901234567"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </span>
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="name@email.com"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="licensePlate" className={labelClass}>
                <span className="inline-flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5" />
                  License Plate *
                </span>
              </label>
              <input
                id="licensePlate"
                type="text"
                required
                value={form.licensePlate}
                onChange={(e) => handleChange('licensePlate', e.target.value.toUpperCase())}
                placeholder="51A-12345"
                className={`${inputClass} font-mono uppercase`}
              />
            </div>
            <div>
              <label htmlFor="carType" className={labelClass}>
                Vehicle Type
              </label>
              <select
                id="carType"
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
              className="px-5 py-2.5 text-sm font-medium text-[#434654] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Customer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
