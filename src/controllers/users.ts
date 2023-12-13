import { NextFunction, Request, Response } from 'express';
import User from '../models/user';
import BadRequestErr from '../errors/bad-request-err';
import NotFoundErr from '../errors/not-found-err';

export const createUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.create({
  name: req.body.name,
  about: req.body.about,
  avatar: req.body.avatar,
})
  .then((user) => res.send(user))
  .catch((err) => {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new BadRequestErr('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });

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

export const updateUserAbout = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.findByIdAndUpdate(
  req.body.user._id,
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

export const updateUserAvatar = (
  req: Request,
  res: Response,
  next: NextFunction,
) => User.findByIdAndUpdate(
  req.body.user._id,
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
