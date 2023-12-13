import { Router } from 'express';
import {
  createUser, getUsers, getUserById, updateUserAbout, updateUserAvatar,
} from '../controllers/users';

const userRouter = Router();
userRouter.get('/', getUsers);
userRouter.get('/:userId', getUserById);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUserAbout);
userRouter.patch('/me/avatar', updateUserAvatar);

export default userRouter;
