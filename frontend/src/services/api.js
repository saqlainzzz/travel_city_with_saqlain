const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const api = {
  // Auth
  auth: {
    login: async (email, password) => {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      const result = await handleResponse(res);
      if (result.success && result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.data));
      }
      return result;
    },
    signup: async (name, email, password, role = 'traveler') => {
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, email, password, role }),
      });
      return handleResponse(res);
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    getCurrentUser: () => {
      if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
      }
      return null;
    },
  },

  // Countries
  countries: {
    list: async () => {
      const res = await fetch(`${API_URL}/api/countries`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    get: async (id) => {
      const res = await fetch(`${API_URL}/api/countries/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (data) => {
      const res = await fetch(`${API_URL}/api/countries`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
  },

  // Cities
  cities: {
    list: async (filters = {}) => {
      // The city routes have a getCity that does find based on filters
      const res = await fetch(`${API_URL}/api/cities/search`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(filters),
      });
      return handleResponse(res);
    },
    getAll: async () => {
      // Let's call /api/cities which maps to get all cities
      const res = await fetch(`${API_URL}/api/cities`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    get: async (id) => {
      const res = await fetch(`${API_URL}/api/cities/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (data) => {
      const res = await fetch(`${API_URL}/api/cities`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
  },

  // Places
  places: {
    list: async (cityId) => {
      const url = cityId 
        ? `${API_URL}/api/places?city=${cityId}`
        : `${API_URL}/api/places`;
      const res = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (data) => {
      const res = await fetch(`${API_URL}/api/places`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
  },

  // Travel Itineraries
  itineraries: {
    list: async () => {
      const res = await fetch(`${API_URL}/api/travel-itineraries`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    get: async (id) => {
      const res = await fetch(`${API_URL}/api/travel-itineraries/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (data) => {
      const res = await fetch(`${API_URL}/api/travel-itineraries`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    update: async (id, data) => {
      const res = await fetch(`${API_URL}/api/travel-itineraries/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_URL}/api/travel-itineraries/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Travel Expenses
  expenses: {
    list: async (itineraryId) => {
      const url = itineraryId
        ? `${API_URL}/api/travel-expenses?itinerary=${itineraryId}`
        : `${API_URL}/api/travel-expenses`;
      const res = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    create: async (data) => {
      const res = await fetch(`${API_URL}/api/travel-expenses`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${API_URL}/api/travel-expenses/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Local Guides
  guides: {
    list: async () => {
      const res = await fetch(`${API_URL}/api/local-guides`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Visa Info
  visaInfo: {
    get: async (countryId) => {
      const res = await fetch(`${API_URL}/api/visa-info/country/${countryId}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    list: async () => {
      const res = await fetch(`${API_URL}/api/visa-info`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },

  // Culture Notes
  cultureNotes: {
    get: async (countryId) => {
      const res = await fetch(`${API_URL}/api/culture-notes/country/${countryId}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
    list: async () => {
      const res = await fetch(`${API_URL}/api/culture-notes`, {
        method: 'GET',
        headers: getHeaders(),
      });
      return handleResponse(res);
    },
  },
};
