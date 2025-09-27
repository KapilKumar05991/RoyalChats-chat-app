import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt'

export interface IUser {
  name: string
  email: string;
  password: string;
  avatar: {
    path: string
    public_id: string
  }
  last_seen: Date
  comparePassword: (password: string) => Promise<boolean>
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true},
  email: { type: String, required: true, lowercase: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: {
    path: {type: String, default: ''},
    public_id: {type: String, default: ''}
  },
  last_seen: { type: Date, default: new Date() }
},{timestamps: true});


UserSchema.pre('save', async function (next) {
  if(!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    return next();
  } catch (error: any) {
    return next(error);
  }
})

UserSchema.methods.comparePassword = function (password:string) {
  return bcrypt.compare(password,this.password);
}

export const User = model<IUser>('User', UserSchema);