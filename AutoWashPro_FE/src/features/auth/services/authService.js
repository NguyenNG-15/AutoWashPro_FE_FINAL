import axiosClient from '../../../app/api/axiosClient';

export async function loginInternal(credentials) {
  const response = await axiosClient.post('/api/v1/auth/login', credentials);
  return response.data?.data ?? response.data;
}
