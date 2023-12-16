import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import { celebrate, Joi, errors } from 'celebrate';
import env from '../config';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import errorMiddleware from './middlewares/error-middleware';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import URL_REGEX from './utils/constants';
import NotFoundErr from './errors/not-found-err';

const app = express();

mongoose.connect(env.DB_URL)
  // eslint-disable-next-line no-console
  .then(() => console.log('MongoDB connected!'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(helmet());
app.use(requestLogger);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
      avatar: Joi.string().pattern(URL_REGEX),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);

app.use(auth);

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundErr('Страница не найдена'));
});

app.use(errorLogger);
app.use(errors());
app.use(errorMiddleware);

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${env.PORT}`);
});
