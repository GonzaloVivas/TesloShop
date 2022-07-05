import mongoose, { Schema, Model, model } from 'mongoose';
import { IUser } from '../interfaces';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: {
      values: ['admin', 'super-user', 'seo', 'client'],
      message: '{VALUE} no es un rol válido',
      default: 'cliente',
      required: true
    }
  }
}, {
  timestamps: true
})

const User: Model<IUser> = mongoose.models.User || model('User', userSchema);

export default User;