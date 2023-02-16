import { Request, Response } from 'express';

import { authService } from '../services';

class AuthController {
  //@POST
  async register(req: Request, res: Response) {
    const response = await authService.register(req.body);
    res.status(201).json({ ...response });
  }

  //@POST
  async login(req: Request, res: Response) {
    const response = await authService.login(req.body);
    res.status(200).json({ ...response });
  }
}

export const authController = new AuthController();
