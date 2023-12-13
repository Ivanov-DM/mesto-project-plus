import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/users';
import cardRouter from './routes/cards';
import authMiddleware from './middleware/auth-middleware';
import errorMiddleware from './middleware/error-middleware';

const { PORT = 3000 } = process.env;
const app = express();
const DB_URL = 'mongodb://127.0.0.1:27017/mestodb';

mongoose.connect(DB_URL)
  // eslint-disable-next-line no-console
  .then(() => console.log('MongoDB connected!'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(authMiddleware);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
