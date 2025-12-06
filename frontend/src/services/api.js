const API_BASE_URL = 'https://komputasiawan-memoria-production.up.railway.app/api';

// --- Helper: Fetch Wrapper pengganti Axios ---
const fetchAPI = async (endpoint, options = {}) => {
  // 1. Ambil Token Otomatis
  const token = localStorage.getItem('token');
  
  const headers = {
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  // 2. Auto-detect JSON Body
  // Jika body adalah object biasa (bukan FormData), ubah ke JSON string & set header
  if (config.body && !(config.body instanceof FormData) && typeof config.body === 'object') {
    config.headers['Content-Type'] = 'application/json';
    config.body = JSON.stringify(config.body);
  }

  // 3. Eksekusi Fetch
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // 4. Handle Error seperti Axios (Throw error jika status bukan 2xx)
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'Terjadi kesalahan API');
    
    // Kita buat struktur error mirip Axios biar frontend tidak perlu diubah banyak
    error.response = {
      status: response.status,
      data: errorData
    };
    throw error;
  }

  // 5. Handle response kosong (misal delete 204)
  if (response.status === 204) return null;

  // 6. Return data JSON langsung
  return response.json();
};

// --- Service Definitions ---

export const authService = {
  register: async (data) => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: data
    });
  },
  
  login: async (data) => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: data
    });
  }
};

export const journalService = {
  getAll: async (search = '') => {
    const url = search ? `/journals?search=${encodeURIComponent(search)}` : '/journals';
    return fetchAPI(url, { method: 'GET' });
  },
  
  getById: async (id) => {
    return fetchAPI(`/journals/${id}`, { method: 'GET' });
  },
  
  create: async (formData) => {
    return fetchAPI('/journals', {
      method: 'POST',
      body: formData
      // PENTING: Jangan set Content-Type manual untuk FormData
      // Browser akan otomatis menambahkan boundary
    });
  },
  
  update: async (id, formData) => {
    return fetchAPI(`/journals/${id}`, {
      method: 'PUT',
      body: formData
    });
  },
  
  delete: async (id) => {
    return fetchAPI(`/journals/${id}`, { method: 'DELETE' });
  }
};

// Tidak perlu export default api lagi karena kita pakai named exports