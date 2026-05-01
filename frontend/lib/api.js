import axios from 'axios';

let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
if (!API_URL.endsWith('/api')) {
  API_URL = `${API_URL.replace(/\/$/, '')}/api`;
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
});

// --- Admin Authentication API ---

export const adminLogin = async (credentials) => {
  const response = await api.post('/admin/login', credentials);
  return response.data;
};

export const adminLogout = async () => {
  const response = await api.post('/admin/logout');
  return response.data;
};

export const checkAdminAuth = async () => {
  const response = await api.get('/admin/me');
  return response.data;
};

// --- Certificate API ---

export const issueCertificate = async (formData) => {
  const response = await api.post('/certificates/issue', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const verifyCertificate = async (certificateId) => {
  const response = await api.get(`/certificates/verify/${certificateId}`);
  return response.data;
};

export const revokeCertificate = async (certificateId) => {
  const response = await api.post(`/certificates/revoke/${certificateId}`);
  return response.data;
};

export const getCertificates = async () => {
  const response = await api.get('/certificates');
  return response.data;
};

export const verifyFile = async (certificateId, file) => {
  const formData = new FormData();
  formData.append('certificate', file);
  
  const response = await api.post(`/certificates/verify-file/${certificateId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
