import axiosClient from '../../../app/api/axiosClient';

export async function loginInternal(credentials) {
  const response = await axiosClient.post('/api/v1/auth/login', credentials);
  return response.data?.data ?? response.data;
}

export async function forgotPassword(email) {
  const response = await axiosClient.post('/api/v1/customer/auth/email/forgot-password', { email });
  return response.data?.data ?? response.data;
}

export async function registerWithEmail(data) {
  const response = await axiosClient.post('/api/v1/customer/auth/email/register', data);
  return response.data?.data ?? response.data;
}

export async function resetPassword(token, newPassword, confirmPassword) {
  const response = await axiosClient.post('/api/v1/customer/auth/email/reset-password', { token, newPassword, confirmPassword });
  return response.data?.data ?? response.data;
}

export async function verifyEmail(token) {
  const response = await axiosClient.get(`/api/v1/customer/auth/email/verify?token=${token}`);
  return response.data?.data ?? response.data;
}
