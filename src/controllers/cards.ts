import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import BadRequestErr from '../errors/bad-request-err';
import NotFoundErr from '../errors/not-found-err';
import ForbiddenError from '../errors/forbidden-error';

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
  owner: req.user._id,
})
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      next(new BadRequestErr('Переданы некорректные данные'));
    } else {
      next(err);
    }
  });

export const deleteCardById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundErr('Карточка с указанным _id не найдена');
      }
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Не хватает прав доступа к запрашиваемому ресурсу');
      }
      card.remove().then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

export const likeCard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
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
  { $pull: { likes: req.user._id } },
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
