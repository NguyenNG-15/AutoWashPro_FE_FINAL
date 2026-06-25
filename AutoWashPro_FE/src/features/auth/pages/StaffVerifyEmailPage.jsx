import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { staffVerifyEmail } from '../services/authService';

export default function StaffVerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  const [manualToken, setManualToken] = useState('');

  const hasFetched = useRef(false);

  useEffect(() => {
    const handleVerify = async () => {
      if (!token) {
        setStatus('idle');
        return;
      }
      
      if (hasFetched.current) return;
      hasFetched.current = true;
      setStatus('verifying');

      try {
        await staffVerifyEmail(token);
        setStatus('success');
      } catch (err) {
        setStatus('error');
        setMessage(
          err.response?.data?.message ??
          err.response?.data?.error ??
          'Kích hoạt tài khoản thất bại. Mã xác thực có thể đã hết hạn hoặc không hợp lệ.'
        );
      }
    };

    handleVerify();
  }, [token]);

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualToken.trim()) {
      window.location.href = `/staff/verify-email?token=${manualToken.trim()}`;
    }
  };

  return (
    <div className="flex justify-center items-center py-24 px-4 bg-[#f7fafd] min-h-[calc(100vh-64px)]">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-[#c3c6d6] w-full max-w-md flex flex-col items-center text-center">
        
        {status === 'idle' && (
          <form onSubmit={handleManualSubmit} className="flex flex-col gap-4 w-full">
            <h1 className="text-2xl font-bold text-[#181c1e] mb-2">Kích hoạt tài khoản</h1>
            <p className="text-[#434654] mb-4">
              Vui lòng dán mã xác thực (token) bạn vừa copy vào ô bên dưới:
            </p>
            <input
              type="text"
              required
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="Dán token vào đây..."
              className="w-full border border-[#c3c6d6] rounded-lg px-4 py-3 focus:outline-none focus:border-[#003d9b] bg-white text-[#181c1e]"
            />
            <button
              type="submit"
              className="bg-[#003d9b] text-white font-medium py-3 rounded-lg hover:bg-[#002f7a] transition shadow-sm mt-2"
            >
              Kích hoạt tài khoản
            </button>
          </form>
        )}

        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <h1 className="text-2xl font-bold text-[#181c1e] mb-2">Đang kích hoạt tài khoản...</h1>
            <p className="text-[#434654]">Vui lòng đợi trong giây lát.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#181c1e] mb-2">Kích hoạt thành công!</h1>
            <p className="text-[#434654] mb-8">
              Tài khoản nhân viên của bạn đã được kích hoạt thành công. Bây giờ bạn có thể đăng nhập vào hệ thống.
            </p>
            <Link to="/login" className="bg-[#003d9b] text-white font-medium py-3 px-8 rounded-lg hover:bg-[#002f7a] transition shadow-sm w-full block">
              Đăng nhập ngay
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#181c1e] mb-2">Kích hoạt thất bại</h1>
            <p className="text-red-600 mb-8">{message}</p>
            <div className="flex flex-col gap-3 w-full">
              <Link to="/login" className="bg-[#003d9b] text-white font-medium py-3 px-8 rounded-lg hover:bg-[#002f7a] transition shadow-sm w-full block">
                Về trang đăng nhập
              </Link>
              <Link to="/staff/verify-email" className="text-[#003d9b] font-medium py-2 hover:underline">
                Thử nhập lại Token khác
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
