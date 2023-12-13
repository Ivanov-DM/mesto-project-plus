import { NextFunction, Request, Response } from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.body.user = {
    _id: '6567a3dba88f410fd9781ebd',
  };
  next();
};

export default authMiddleware;
