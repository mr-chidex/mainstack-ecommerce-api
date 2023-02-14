import { Request, Response } from 'express';

import { authService } from '../services';

class AuthController {
  async register(req: Request, res: Response) {
    const response = await authService.register(req.body);
    return res.status(201).json({ ...response });
  }
}

export const authController = new AuthController();
