import { Router } from 'express';
import {
  getUsers, getUserById, updateUserAbout, updateUserAvatar, getCurrentUser,
} from '../controllers/users';

const userRouter = Router();
userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUser);
userRouter.get('/:userId', getUserById);
userRouter.patch('/me', updateUserAbout);
userRouter.patch('/me/avatar', updateUserAvatar);

export default userRouter;
