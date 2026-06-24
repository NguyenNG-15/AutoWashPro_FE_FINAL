import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { registerWithEmail } from '../services/authService';

export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const username = email.split('@')[0];
      await registerWithEmail({ 
        fullName: name, 
        username: username,
        email: email, 
        phoneNumber: phone, 
        password: password 
      });
      // Redirect or show success message
      navigate('/login', { state: { message: 'Đăng ký thành công. Vui lòng đăng nhập.' } });
    } catch (err) {
      console.error("Register error:", err.response?.data || err);
      let errorMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';

      const errorsDetail = err.response?.data?.errors;
      if (errorsDetail) {
        if (Array.isArray(errorsDetail)) {
          errorMsg = errorsDetail.map(e => e.msg || e.message || JSON.stringify(e)).join(', ');
        } else if (typeof errorsDetail === 'object') {
          errorMsg = Object.values(errorsDetail).flat().join(', ');
        }
      } else if (Array.isArray(err.response?.data?.message)) {
        errorMsg = err.response?.data?.message.join(', ');
      }

      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-[#181c1e] text-sm font-medium">Họ và tên</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nguyễn Văn A"
            className="w-full border border-[#e0e3e6] rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-[#003d9b] bg-white text-[#181c1e] placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1">
          <label className="text-[#181c1e] text-sm font-medium">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full border border-[#e0e3e6] rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-[#003d9b] bg-white text-[#181c1e] placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[#181c1e] text-sm font-medium">Số điện thoại</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="090 123 4567"
              className="w-full border border-[#e0e3e6] rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-[#003d9b] bg-white text-[#181c1e] placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[#181c1e] text-sm font-medium">Mật khẩu</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-[#e0e3e6] rounded-lg pl-11 pr-11 py-3 focus:outline-none focus:border-[#003d9b] bg-white text-[#181c1e] placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[#181c1e] text-sm font-medium">Xác nhận mật khẩu</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-[#e0e3e6] rounded-lg pl-11 pr-11 py-3 focus:outline-none focus:border-[#003d9b] bg-white text-[#181c1e] placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="flex items-start gap-3 mt-2">
        <div className="flex items-center h-5 mt-[2px]">
          <input type="checkbox" required className="w-4 h-4 text-[#0052cc] border-[#e0e3e6] rounded focus:ring-[#0052cc]" />
        </div>
        <p className="text-sm text-[#434654] leading-relaxed">
          Tôi đồng ý với các <Link to="/terms" className="text-[#003d9b] hover:underline font-medium">Điều khoản dịch vụ</Link> và <Link to="/privacy" className="text-[#003d9b] hover:underline font-medium">Chính sách bảo mật</Link>.
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#0052cc] text-white font-medium py-3.5 rounded-lg hover:bg-[#0047b3] transition shadow-sm mt-2 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Đang xử lý...' : (
          <>
            Đăng ký ngay
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
