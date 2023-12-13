import { Router } from 'express';
import {
  createCard, getCards, deleteCardById, likeCard, dislikeCard,
} from '../controllers/cards';

const cardRouter = Router();
cardRouter.get('/', getCards);
cardRouter.delete('/:cardId', deleteCardById);
cardRouter.post('/', createCard);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);

export default cardRouter;
