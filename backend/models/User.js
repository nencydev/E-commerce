import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: Number,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  img: { type: String, default: '' },

}, { timestamps: true });

export default mongoose.model('User', userSchema);
