import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { register } from '../features/auth/authSlice';

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('password', form.password);
    if (photo) {
      formData.append('photo', photo);
    }

    dispatch(register(formData))
      .unwrap()
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Registration successful!',
          text: 'You can now log in.',
          timer: 2000,
          showConfirmButton: false
        });
        setTimeout(() => navigate('/login'), 2000);
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err || 'Something went wrong!'
        });
      });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl space-y-5">
      <h2 className="text-2xl font-bold text-center text-blue-600">Register</h2>

      <input
        type="text"
        placeholder="Full Name"
        className="w-full p-3 border border-gray-300 rounded"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <input
        type="email"
        placeholder="Email Address"
        className="w-full p-3 border border-gray-300 rounded"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 border border-gray-300 rounded"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />

      <input
        type="file"
        accept="image/*"
        className="w-full p-2 border border-gray-300 rounded"
        onChange={handleImageChange}
      />

      {preview && (
        <div className="text-center">
          <img src={preview} alt="Preview" className="mx-auto h-24 w-24 rounded-full object-cover" />
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>

      {error && <p className="text-red-500 text-center">{error}</p>}
    </form>
  );
}
