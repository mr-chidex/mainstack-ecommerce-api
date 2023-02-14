import { IUser } from '../models';

export class AuthService {
  async register(body: IUser) {
    return {
      success: true,
      message: 'Account successfully created',
    };
  }
}

export const authService = new AuthService();
