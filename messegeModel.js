import mongoose from 'mongoose';

const MessegeScheme = new mongoose.Schema(
  {
    name: String,
    message: String,
    received: Boolean,
  },
  { timestamps: true },
);

const Messege = new mongoose.model('messege', MessegeScheme);

export default Messege;
