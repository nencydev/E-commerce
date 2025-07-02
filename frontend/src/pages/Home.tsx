import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

type User = {
  _id: string;
  name: string;
  email: string;
  img?: string;
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const editingUser = users.find((u) => u._id === editingUserId);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/users', {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'User will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
          withCredentials: true,
        });
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
        fetchUsers();
      } catch (err) {
        Swal.fire('Error', 'Could not delete user.', 'error');
      }
    }
  };

  const handleEditClick = (user: User) => {
    setForm({ name: user.name, email: user.email });
    setEditingUserId(user._id);
    setPhoto(null);
    setPreview(null);
  };

  const handleUpdate = async () => {
    if (!editingUserId) return;

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    if (photo) formData.append('photo', photo);

    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/users/${editingUserId}`,
        {
          method: 'PUT',
          body: formData,
          credentials: 'include',
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Update failed');

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'User details updated successfully',
        timer: 2000,
        showConfirmButton: false,
      });

      setEditingUserId(null);
      setForm({ name: '', email: '' });
      setPhoto(null);
      setPreview(null);
      fetchUsers();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Something went wrong',
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Registered Users</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Photo</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-center">
              <td className="p-2 border">
                <img
                  src={
                    user.img
                      ? `http://localhost:5000/uploads/${user.img}`
                      : '/default-avatar.png'
                  }
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover mx-auto"
                />
              </td>
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleEditClick(user)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit Form */}
      {editingUserId && (
        <div className="mt-6 p-4 border rounded shadow-lg bg-white">
          <h3 className="text-lg font-semibold mb-2">Edit User</h3>

          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="block w-full mb-2 p-2 border rounded"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="block w-full mb-2 p-2 border rounded"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const previewURL = URL.createObjectURL(file);
                setPhoto(file);
                setPreview(previewURL);
              }
            }}
            className="block w-full mb-2 p-2 border rounded"
          />

          {/* Show preview or existing image */}
          {(preview || editingUser?.img) && (
            <div className="mb-2">
              <img
                src={
                  preview
                    ? preview
                    : `http://localhost:5000/uploads/${editingUser?.img}`
                }
                alt="User"
                className="h-20 w-20 rounded-full object-cover border mx-auto"
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={handleUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditingUserId(null);
                setPreview(null);
              }}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
