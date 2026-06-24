import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../../app/store/authStore';
import { getDefaultRouteForRoles } from '../utils/roleUtils';

export default function LoginForm() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await login({ username, password });
      const roles = data.roles ?? useAuthStore.getState().roles;
      const destination = getDefaultRouteForRoles(roles);
      navigate(destination, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ??
        err.response?.data?.error ??
        err.message ??
        'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="text-[#181c1e] text-sm font-medium">
          Tên đăng nhập
        </label>
        <input
          id="username"
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="admin"
          autoComplete="username"
          className="w-full border border-[#c3c6d6] rounded-lg px-4 py-3 focus:outline-none focus:border-[#003d9b] bg-white text-[#181c1e]"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-[#181c1e] text-sm font-medium">
          Mật khẩu
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          className="w-full border border-[#c3c6d6] rounded-lg px-4 py-3 focus:outline-none focus:border-[#003d9b] bg-white text-[#181c1e]"
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="w-4 h-4 text-[#003d9b] border-[#c3c6d6] rounded" />
          <span className="text-sm text-[#434654]">Ghi nhớ</span>
        </label>
        <Link to="/forgot-password" className="text-sm text-[#003d9b] hover:underline font-medium">
          Quên mật khẩu?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-[#003d9b] text-white font-medium py-3 rounded-lg hover:bg-[#002f7a] transition shadow-sm mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>

      <div className="text-center text-sm text-[#434654] mt-4">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="text-[#003d9b] font-medium hover:underline">
          Đăng ký ngay
        </Link>
      </div>
    </form>
  );
}
