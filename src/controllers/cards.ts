import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import BadRequestErr from '../errors/bad-request-err';
import NotFoundErr from '../errors/not-found-err';

export const getCards = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Card.find({})
  .then((cards) => res.send(cards))
  .catch(next);

export const createCard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Card.create({
  name: req.body.name,
  link: req.body.link,
  owner: req.body.user._id,
})
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new BadRequestErr('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });

export const deleteCardById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Card.findByIdAndRemove(req.params.cardId)
  .then((card) => {
    if (!card) {
      throw new NotFoundErr('Передан несуществующий _id карточки');
    }
    res.send({ message: 'Карточка удалена' });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestErr('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });

export const likeCard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.body.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundErr('Карточка с указанным _id не найдена');
    }
    res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestErr('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });

export const dislikeCard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.body.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundErr('Карточка с указанным _id не найдена');
    }
    res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestErr('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });
