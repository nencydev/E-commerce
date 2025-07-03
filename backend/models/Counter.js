// 📁 models/Counter.js
import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  id: { type: String, required: true }, // Like: "user_id"
  seq: { type: Number, default: 0 },
});

export default mongoose.model('Counter', counterSchema);
