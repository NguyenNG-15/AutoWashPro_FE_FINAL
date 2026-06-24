import { useState } from 'react';
import { Car, Mail, Phone, Save, User } from 'lucide-react';
import useAuthStore from '../../../app/store/authStore';

const initialProfile = {
  fullName: 'Nguyễn Văn A',
  email: 'nguyenvana@email.com',
  phone: '090 123 4567',
  licensePlate: '51A-123.45',
  carType: 'Sedan',
  address: 'Quận 1, TP.HCM',
};

export default function CustomerProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [profile, setProfile] = useState({
    ...initialProfile,
    fullName: user?.fullName ?? user?.name ?? user?.username ?? initialProfile.fullName,
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (field) => (e) => {
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <div className="p-8">
      <div className="max-w-[900px] mx-auto flex flex-col gap-8">
        <div>
          <h1 className="text-[#181c1e] text-3xl font-bold">Hồ sơ cá nhân</h1>
          <p className="text-[#434654] mt-2">Quản lý thông tin tài khoản và xe của bạn.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0px_4px_10px_rgba(31,41,55,0.08)] flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0047AB] to-[#0066cc] flex items-center justify-center text-white text-xl font-bold">
            {profile.fullName.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#181c1e]">{profile.fullName}</h2>
            <p className="text-sm text-[#434654]">Thành viên Vàng · 2,450 điểm</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0px_4px_10px_rgba(31,41,55,0.08)] flex flex-col gap-6"
        >
          <h2 className="text-lg font-semibold text-[#181c1e]">Thông tin liên hệ</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#434654] mb-1 block">Họ và tên</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#848a9c]" />
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={handleChange('fullName')}
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#434654] mb-1 block">Số điện thoại</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#848a9c]" />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={handleChange('phone')}
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#434654] mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#848a9c]" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={handleChange('email')}
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#434654] mb-1 block">Địa chỉ</label>
              <input
                type="text"
                value={profile.address}
                onChange={handleChange('address')}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
              />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-[#181c1e] pt-2">Thông tin xe</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#434654] mb-1 block">Biển số xe</label>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#848a9c]" />
                <input
                  type="text"
                  value={profile.licensePlate}
                  onChange={handleChange('licensePlate')}
                  className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB]"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#434654] mb-1 block">Loại xe</label>
              <select
                value={profile.carType}
                onChange={handleChange('carType')}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0047AB]/20 focus:border-[#0047AB] bg-white"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Pickup">Pickup</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saved && <p className="text-sm text-[#065f46] font-medium">Đã lưu thay đổi.</p>}
            <button
              type="submit"
              className="ml-auto flex items-center gap-2 bg-[#0047AB] hover:bg-[#003a8c] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Lưu hồ sơ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
