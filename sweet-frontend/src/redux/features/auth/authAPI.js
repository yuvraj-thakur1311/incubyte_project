// Optional: Centralized API calls for auth - you can import instead of raw fetch within slice if preferred

const API_URL = 'http://localhost:5000/api';

export const loginApi = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Login failed');
  }

  const data = await res.json();

  // Save JWT token to localStorage
  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  return data; // keep the whole object so you can use userId/role if needed
};


export const registerApi = async (username, email, password) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Registration failed');
  }
  return res.json();
};
