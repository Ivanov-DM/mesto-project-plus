import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  createCard, getCards, deleteCardById, likeCard, dislikeCard,
} from '../controllers/cards';
import URL_REGEX from '../utils/constants';

const cardRouter = Router();
cardRouter.get('/', getCards);
cardRouter.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().alphanum().length(24),
    }),
  }),
  deleteCardById,
);
cardRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(URL_REGEX),
    }),
  }),
  createCard,
);
cardRouter.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().alphanum().length(24),
    }),
  }),
  likeCard,
);
cardRouter.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().alphanum().length(24),
    }),
  }),
  dislikeCard,
);

export default cardRouter;
