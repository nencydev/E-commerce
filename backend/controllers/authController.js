import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const img = req.file?.filename || ''; // 👈 get uploaded image file name

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      img, // 👈 assign image filename to `img`
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  res.cookie('token', token, { httpOnly: true }).json({ message: 'Login successful', token });
};

// Logout
export const logout = (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out' });
};


// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    console.log('Users:', users); // ✅ Debug log
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

//Update User

// Update user by ID
export const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const img = req.file?.filename; // 👈 new image if uploaded

    const updatedFields = {};

    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (img) updatedFields.img = img;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    ).select('-password'); // exclude password from response

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update user' });
  }
};
