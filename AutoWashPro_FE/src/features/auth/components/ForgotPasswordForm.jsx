import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Integrate with actual forgot password API
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#181c1e] mb-2">Đã gửi liên kết!</h3>
        <p className="text-[#434654] mb-8">
          Chúng tôi đã gửi email đến <strong className="text-[#181c1e]">{email}</strong> với hướng dẫn chi tiết để đặt lại mật khẩu của bạn.
        </p>
        <Link to="/login" className="bg-[#003d9b] text-white font-medium py-3 px-8 rounded-lg hover:bg-[#002f7a] transition shadow-sm w-full block">
          Quay lại đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-[#181c1e] text-sm font-medium">
          Địa chỉ Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@mail.com"
          className="w-full border border-[#c3c6d6] rounded-lg px-4 py-3 focus:outline-none focus:border-[#003d9b] bg-white text-[#181c1e]"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-[#003d9b] text-white font-medium py-3 rounded-lg hover:bg-[#002f7a] transition shadow-sm mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
      </button>

      <div className="text-center text-sm text-[#434654] mt-4">
        Nhớ mật khẩu?{' '}
        <Link to="/login" className="text-[#003d9b] font-medium hover:underline">
          Đăng nhập ngay
        </Link>
      </div>
    </form>
  );
}
