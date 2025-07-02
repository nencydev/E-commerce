import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { login, logout } from '../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector(state => state.auth);

  const [form, setForm] = useState({ email: '', password: '' });
      const { user } = useAppSelector(state => state.auth);
 const handleLogout = () => {
  dispatch(logout());
  localStorage.removeItem('token'); // ⬅️ Clear localStorage
  Swal.fire({
    icon: 'success',
    title: 'Logged out',
    text: 'You have been logged out',
    timer: 1500,
    showConfirmButton: false,
  });
  // setTimeout(() => navigate('/login'), 1500); // ⬅️ Redirect after 1.5s
  navigate('/login'); // ⬅️ Redirect immediately
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(login(form))
      .unwrap()
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Login successful!',
          text: 'Welcome back!',
          timer: 2000,
          showConfirmButton: false
        });
        // setTimeout(() => navigate('/'), 2000); // ⬅️ Redirect after 2s
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: err || 'Invalid credentials'
        });
      });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit" className="w-full bg-green-600 text-white py-2">
        {loading ? 'Logging in...' : 'Login'}
      </button>

{user && (
  <button
    type="button"
    onClick={handleLogout}
    className="w-full bg-red-500 text-white py-2 mt-2"
  >
    Logout
  </button>
)}

    </form>
    
  );
}
