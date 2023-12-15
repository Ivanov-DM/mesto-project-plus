import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import BadRequestErr from '../errors/bad-request-err';
import NotFoundErr from '../errors/not-found-err';

export const createUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

export const getUsers = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.find({})
  .then((users) => res.send(users))
  .catch(next);

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      throw new NotFoundErr('Пользователь по указанному _id не найден');
    }
    res.send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestErr('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });

export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

export const updateUserAbout = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { name: req.body.name, about: req.body.about } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

export const updateUserAvatar = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.findByIdAndUpdate(
  req.user._id,
  { $set: { avatar: req.body.avatar } },
  {
    new: true,
    runValidators: true,
    upsert: false,
  },
)
  .then((user) => {
    if (!user) {
      throw new NotFoundErr('Пользователь по указанному _id не найден');
    }
    res.send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new BadRequestErr('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });

export const login = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
