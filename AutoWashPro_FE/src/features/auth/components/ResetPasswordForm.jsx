import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../services/authService';

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [manualToken, setManualToken] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    const effectiveToken = token || manualToken.trim();
    if (!effectiveToken) {
      setError('Vui lòng nhập mã xác thực (token).');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await resetPassword(effectiveToken, password, confirmPassword);
      setIsSubmitted(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      const message =
        err.response?.data?.message ??
        err.response?.data?.error ??
        err.message ??
        'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#181c1e] mb-2">Đổi mật khẩu thành công!</h3>
        <p className="text-[#434654] mb-8">
          Mật khẩu của bạn đã được thay đổi. Bạn sẽ được chuyển hướng về trang đăng nhập...
        </p>
        <Link to="/login" className="bg-[#003d9b] text-white font-medium py-3 px-8 rounded-lg hover:bg-[#002f7a] transition shadow-sm w-full block">
          Quay lại đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      
      {!token && (
        <div className="flex flex-col gap-1 mb-2">
          <label htmlFor="manualToken" className="text-[#181c1e] text-sm font-medium">
            Mã xác thực (Token)
          </label>
          <input
            id="manualToken"
            type="text"
            required={!token}
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            placeholder="Dán mã xác thực vào đây..."
            className="w-full border border-[#c3c6d6] rounded-lg px-4 py-3 focus:outline-none focus:border-[#003d9b] bg-white text-[#181c1e]"
          />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-[#181c1e] text-sm font-medium">
          Mật khẩu mới
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full border border-[#c3c6d6] rounded-lg px-4 py-3 focus:outline-none focus:border-[#003d9b] bg-white text-[#181c1e]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="confirmPassword" className="text-[#181c1e] text-sm font-medium">
          Xác nhận mật khẩu mới
        </label>
        <input
          id="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full border border-[#c3c6d6] rounded-lg px-4 py-3 focus:outline-none focus:border-[#003d9b] bg-white text-[#181c1e]"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || (!token && !manualToken.trim())}
        className="bg-[#003d9b] text-white font-medium py-3 rounded-lg hover:bg-[#002f7a] transition shadow-sm mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
      </button>
    </form>
  );
}
