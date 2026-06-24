export const carTypes = [
  { value: 'SEDAN', label: 'Sedan' },
  { value: 'SUV', label: 'SUV' },
  { value: 'TRUCK', label: 'Truck / Pickup' },
  { value: 'VAN', label: 'Van / MPV' },
  { value: 'HATCHBACK', label: 'Hatchback' },
  { value: 'OTHER', label: 'Other' },
];

export const inputClass =
  'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#181c1e] bg-white focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]';

export const labelClass = 'text-[#434654] text-sm font-medium mb-1.5 block';

export function normalizeCarTypeValue(carType = '') {
  const upper = carType.toUpperCase();
  return carTypes.some((type) => type.value === upper) ? upper : 'OTHER';
}

export function emptyCustomerForm() {
  return {
    fullName: '',
    phoneNumber: '',
    email: '',
    licensePlate: '',
    carType: 'SEDAN',
  };
}

export function customerToForm(customer) {
  if (!customer) return emptyCustomerForm();

  return {
    fullName: customer.name === '—' ? '' : customer.name,
    phoneNumber: customer.phone === '—' ? '' : customer.phone,
    email: customer.email === '—' ? '' : customer.email,
    licensePlate: customer.plate === '—' ? '' : customer.plate,
    carType: normalizeCarTypeValue(customer.carType),
  };
}
