import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CalendarClock, Car, Loader2, Search, User, UserPlus } from 'lucide-react';
import useBookingStore from '../store/bookingStore';
import {
  buildCreateBookingPayload,
  createBooking,
  fetchBookingServices,
  fetchBookingSlots,
  formatCurrency,
  getApiErrorMessage,
} from '../services/bookingService';
import { fetchCustomers } from '../services/customerService';
import { carTypes, normalizeCarTypeValue } from '../data/customerFormOptions';

const emptyForm = {
  bookingType: 'walk-in',
  customerId: 'new',
  customerName: '',
  phone: '',
  email: '',
  plate: '',
  vehicleType: 'SEDAN',
  serviceId: '',
  bookingDate: new Date().toISOString().split('T')[0],
  slotId: '',
  notes: '',
};

const inputClass =
  'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#181c1e] bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]';
const labelClass = 'text-[#434654] text-sm font-medium mb-1.5 block';

export default function QuickNewBookingModal() {
  const navigate = useNavigate();
  const isOpen = useBookingStore((state) => state.isQuickBookingOpen);
  const closeQuickBooking = useBookingStore((state) => state.closeQuickBooking);
  const setLastCreatedBooking = useBookingStore((state) => state.setLastCreatedBooking);
  const openWorkflowBooking = useBookingStore((state) => state.openWorkflowBooking);
  const triggerRefresh = useBookingStore((state) => state.triggerRefresh);

  const [form, setForm] = useState(emptyForm);
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const customerPickerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const today = new Date().toISOString().split('T')[0];
    setForm({ ...emptyForm, bookingDate: today });
    setCustomerSearch('');
    setCustomers([]);
    setIsCustomerDropdownOpen(false);
    setError('');

    const loadCatalog = async () => {
      setIsLoadingCatalog(true);
      try {
        const [serviceList, slotList] = await Promise.all([
          fetchBookingServices(),
          fetchBookingSlots(),
        ]);
        setServices(serviceList);
        setSlots(slotList);
        setForm((prev) => ({
          ...prev,
          slotId: prev.slotId || (slotList[0] ? String(slotList[0].id) : ''),
        }));
      } catch {
        setServices([]);
        setSlots([]);
      } finally {
        setIsLoadingCatalog(false);
      }
    };

    loadCatalog();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const timer = setTimeout(async () => {
      setIsLoadingCustomers(true);
      try {
        const result = await fetchCustomers({
          page: 0,
          size: 20,
          search: customerSearch.trim(),
        });
        setCustomers(result.customers);
      } catch {
        setCustomers([]);
      } finally {
        setIsLoadingCustomers(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [isOpen, customerSearch]);

  useEffect(() => {
    if (!isCustomerDropdownOpen) return undefined;

    const handleClickOutside = (event) => {
      if (customerPickerRef.current && !customerPickerRef.current.contains(event.target)) {
        setIsCustomerDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCustomerDropdownOpen]);

  if (!isOpen) return null;

  const selectedService = services.find((service) => String(service.id) === String(form.serviceId));

  const handleChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'bookingType' && value === 'walk-in') {
        next.bookingDate = new Date().toISOString().split('T')[0];
      }
      return next;
    });
  };

  const handleSelectNewCustomer = () => {
    setForm((prev) => ({
      ...prev,
      customerId: 'new',
      customerName: '',
      phone: '',
      email: '',
      plate: '',
      vehicleType: 'SEDAN',
    }));
    setCustomerSearch('');
    setIsCustomerDropdownOpen(false);
  };

  const handleSelectCustomer = (customer) => {
    setForm((prev) => ({
      ...prev,
      customerId: customer.id,
      customerName: customer.name === '—' ? '' : customer.name,
      phone: customer.phone === '—' ? '' : customer.phone,
      email: customer.email === '—' ? '' : customer.email,
      plate: customer.plate === '—' ? '' : customer.plate,
      vehicleType: normalizeCarTypeValue(customer.carType),
    }));
    setCustomerSearch(customer.name);
    setIsCustomerDropdownOpen(false);
  };

  const handleSlotChange = (value) => {
    setForm((prev) => ({
      ...prev,
      slotId: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.customerName.trim()) {
      setError('Please enter customer name.');
      return;
    }
    if (!form.phone.trim()) {
      setError('Please enter phone number.');
      return;
    }
    if (!form.plate.trim()) {
      setError('Please enter license plate.');
      return;
    }
    if (!form.serviceId) {
      setError('Please select a service.');
      return;
    }
    if (!Number.isFinite(Number(form.serviceId))) {
      setError('Invalid service. Please select again.');
      return;
    }
    if (!form.slotId) {
      setError('Please select a time slot.');
      return;
    }
    if (!Number.isFinite(Number(form.slotId))) {
      setError('Invalid time slot. Please select again.');
      return;
    }
    if (form.bookingType === 'appt' && !form.bookingDate) {
      setError('Please select appointment date.');
      return;
    }

    setIsSubmitting(true);
    try {
      const booking = await createBooking(buildCreateBookingPayload(form));
      setLastCreatedBooking(booking);
      openWorkflowBooking(booking.id);
      triggerRefresh();
      setForm(emptyForm);
      navigate('/admin/bookings');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to create booking. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/40"
        onClick={closeQuickBooking}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-start justify-between gap-4 z-10">
          <div>
            <h2 className="text-[#181c1e] text-xl font-bold">Quick New Booking</h2>
            <p className="text-[#848a9c] text-sm mt-1">
              Create a quick wash booking for walk-in or scheduled customers.
            </p>
          </div>
          <button type="button" onClick={closeQuickBooking} className="p-2 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-[#434654]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <section>
            <h3 className="text-[#181c1e] text-sm font-bold mb-3">Booking Type</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange('bookingType', 'walk-in')}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors text-left ${
                  form.bookingType === 'walk-in'
                    ? 'border-[#0047AB] bg-[#E6F0FF]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Car className="w-5 h-5 text-[#0047AB]" />
                <div>
                  <p className="text-sm font-semibold text-[#181c1e]">Walk-in</p>
                  <p className="text-xs text-[#848a9c]">Customer arrives directly</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleChange('bookingType', 'appt')}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-colors text-left ${
                  form.bookingType === 'appt'
                    ? 'border-[#0047AB] bg-[#E6F0FF]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CalendarClock className="w-5 h-5 text-[#0047AB]" />
                <div>
                  <p className="text-sm font-semibold text-[#181c1e]">Appointment</p>
                  <p className="text-xs text-[#848a9c]">Pre-scheduled customer</p>
                </div>
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-[#181c1e] text-sm font-bold mb-3">Customer Information</h3>
            <div className="flex flex-col gap-4">
              <div className="relative" ref={customerPickerRef}>
                <label htmlFor="customerSearch" className={labelClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Select existing customer
                  </span>
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#848a9c]" />
                  <input
                    id="customerSearch"
                    type="text"
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setIsCustomerDropdownOpen(true);
                      if (form.customerId !== 'new') {
                        setForm((prev) => ({ ...prev, customerId: 'new' }));
                      }
                    }}
                    onFocus={() => setIsCustomerDropdownOpen(true)}
                    placeholder="Search by name, phone, or plate..."
                    className={`${inputClass} pl-10`}
                  />
                  {isLoadingCustomers && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0047AB] animate-spin" />
                  )}
                </div>

                {isCustomerDropdownOpen && (
                  <div className="absolute z-20 mt-1 w-full max-h-52 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={handleSelectNewCustomer}
                      className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm hover:bg-[#f7fafd] border-b border-gray-100"
                    >
                      <UserPlus className="w-4 h-4 text-[#0047AB] shrink-0" />
                      <span className="font-medium text-[#181c1e]">New customer (manual entry)</span>
                    </button>
                    {customers.length === 0 && !isLoadingCustomers ? (
                      <p className="px-4 py-3 text-sm text-[#848a9c]">No customers found.</p>
                    ) : (
                      customers.map((customer) => (
                        <button
                          key={customer.id}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectCustomer(customer);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#f7fafd] border-b border-gray-50 last:border-0"
                        >
                          <div
                            className={`w-8 h-8 rounded-full ${customer.avatarBg} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}
                          >
                            {customer.initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-[#181c1e] truncate">{customer.name}</p>
                            <p className="text-xs text-[#848a9c] truncate">
                              {customer.phone} · {customer.plate} · {customer.membership}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {form.customerId !== 'new' && (
                <div className="rounded-lg bg-[#E6F0FF] border border-[#0047AB]/20 px-4 py-2.5 text-sm text-[#0047AB] font-medium">
                  Selected customer #{form.customerId} — you can edit details below if needed.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customerName" className={labelClass}>
                    Full Name *
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    required
                    value={form.customerName}
                    onChange={(e) => handleChange('customerName', e.target.value)}
                    placeholder="John Doe"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="0901234567"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className={labelClass}>
                    Email
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
            </div>
          </section>

          <section>
            <h3 className="text-[#181c1e] text-sm font-bold mb-3">Vehicle Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="plate" className={labelClass}>
                  License Plate *
                </label>
                <input
                  id="plate"
                  type="text"
                  required
                  value={form.plate}
                  onChange={(e) => handleChange('plate', e.target.value.toUpperCase())}
                  placeholder="51A-12345"
                  className={`${inputClass} font-mono uppercase`}
                />
              </div>
              <div>
                <label htmlFor="vehicleType" className={labelClass}>
                  Vehicle Type
                </label>
                <select
                  id="vehicleType"
                  value={form.vehicleType}
                  onChange={(e) => handleChange('vehicleType', e.target.value)}
                  className={inputClass}
                >
                  {carTypes.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[#181c1e] text-sm font-bold mb-3">Service &amp; Schedule</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="serviceId" className={labelClass}>
                  Service *
                </label>
                <select
                  id="serviceId"
                  required
                  value={form.serviceId}
                  onChange={(e) => handleChange('serviceId', e.target.value)}
                  className={inputClass}
                  disabled={isLoadingCatalog}
                >
                  <option value="">
                    {isLoadingCatalog ? 'Loading services...' : '-- Select service --'}
                  </option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} — {formatCurrency(service.price)} ({service.duration})
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="timeSlot" className={labelClass}>
                  Time Slot *
                </label>
                <select
                  id="timeSlot"
                  required
                  value={form.slotId}
                  onChange={(e) => handleSlotChange(e.target.value)}
                  className={inputClass}
                  disabled={isLoadingCatalog || slots.length === 0}
                >
                  <option value="">
                    {isLoadingCatalog
                      ? 'Loading time slots...'
                      : slots.length === 0
                        ? 'No time slots available'
                        : '-- Select time slot --'}
                  </option>
                  {slots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </div>
              {form.bookingType === 'appt' && (
                <div>
                  <label htmlFor="bookingDate" className={labelClass}>
                    Appointment Date *
                  </label>
                  <input
                    id="bookingDate"
                    type="date"
                    required
                    value={form.bookingDate}
                    onChange={(e) => handleChange('bookingDate', e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}
              {form.bookingType === 'walk-in' && (
                <div>
                  <label className={labelClass}>Date</label>
                  <input
                    type="date"
                    value={form.bookingDate}
                    readOnly
                    className={`${inputClass} bg-[#f7fafd] text-[#848a9c]`}
                  />
                </div>
              )}
              <div className="sm:col-span-2">
                <label htmlFor="notes" className={labelClass}>
                  Notes
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Special requests..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </section>

          {selectedService && (
            <div className="rounded-xl bg-[#f7fafd] border border-gray-200 px-4 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#181c1e]">{selectedService.name}</p>
                <p className="text-xs text-[#848a9c] mt-0.5">
                  Est. duration: {selectedService.duration}
                </p>
              </div>
              <p className="text-lg font-bold text-[#0047AB]">
                {formatCurrency(selectedService.price)}
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={closeQuickBooking}
              className="px-5 py-2.5 text-sm font-medium text-[#434654] border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold rounded-lg disabled:opacity-60 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Creating...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
