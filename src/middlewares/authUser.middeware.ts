import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import config from '../config';
import { User } from '../models';
import { JWTTOKEN } from '../services';
import { errorResponse } from '../utils';

class AuthMiddleware {
  async auth(req: Request | any, res: Response | any, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) {
      return errorResponse('No authorization header', 401);
    }

    if (!authorization.includes('Bearer')) {
      return errorResponse('Invalid token format', 401);
    }

    const token = authorization.replace('Bearer ', '');

    try {
      const decodeToken = jwt.verify(token, config.SECRET_KEY) as JWTTOKEN;

      const user = await User.findById(decodeToken?.userId);

      if (!user) {
        return errorResponse('Unauthorized Access', 403);
      }

      req.user = user;

      next();
    } catch (err: any) {
      return errorResponse(err.message, 401);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
