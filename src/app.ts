import express from 'express';
import mongoose from 'mongoose';
import { celebrate, Joi, errors } from 'celebrate';
import 'dotenv/config';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import errorMiddleware from './middlewares/error-middleware';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import URL_REGEX from './utils/constants';

const { PORT = 3000, DB_URL } = process.env;
const app = express();

mongoose.connect(DB_URL!)
  // eslint-disable-next-line no-console
  .then(() => console.log('MongoDB connected!'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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
app.use(errorLogger);
app.use(errors());
app.use(errorMiddleware);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
