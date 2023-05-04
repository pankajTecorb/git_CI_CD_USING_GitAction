import { Schema, model } from 'mongoose';


interface User {
  name: string;
  userName:string;
  email: string;
  role: string;
  image: string;
  bio: string;
  password: string;
  lastLoginAt: number
  isActive: boolean;
  isDelete: boolean;


}

const schema = new Schema<User>({
  name: { type: String },
  userName: { type: String },
  email: { type: String, required: true },
  role: { type: String, default: "User" },
  image: { type: String},
  bio: { type: String },
  lastLoginAt: { type: Number },
  password: { type: String },
  isActive: { type: Boolean, default: true },
  isDelete: { type: Boolean, default: false },
}, {
  timestamps: true,
  versionKey: false
});

schema.index({ email: 1 }, { unique: true });
const userModel = model<User>('users', schema);
export = userModel
