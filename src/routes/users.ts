import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUsers, getUserById, updateUserInfo,
} from '../controllers/users';
import URL_REGEX from '../utils/constants';

const userRouter = Router();
userRouter.get('/', getUsers);
userRouter.get('/me', getUserById);
userRouter.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().alphanum().length(24),
    }),
  }),
  getUserById,
);
userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(200),
    }),
  }),
  updateUserInfo,
);
userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(URL_REGEX),
    }),
  }),
  updateUserInfo,
);

export default userRouter;
