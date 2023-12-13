import mongoose from 'mongoose';
import validateUrl from '../utils/utils';

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

export const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
    validate: validateUrl,
  },
});

export default mongoose.model<IUser>('user', userSchema);
