import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../../config';
import User from '../models/user';
import BadRequestErr from '../errors/bad-request-err';
import NotFoundErr from '../errors/not-found-err';
import ConflictError from '../errors/conflict-error';

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
    .then((user) => {
      const {
        name, about, avatar, email,
      } = user;
      res.send({
        name, about, avatar, email,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
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
) => {
  const _id = !req.params.userId ? req.user : req.params.userId;
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

export const updateUserInfo = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, about, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { $set: { name, about, avatar } },
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

export const login = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        env.JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};
