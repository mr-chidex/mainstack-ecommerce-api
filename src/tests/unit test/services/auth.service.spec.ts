import bcrypt from 'bcrypt';

import { User } from '../../../models';
import { authService } from '../../../services';
import { errorResponse } from '../../../utils';

describe('AuthService', () => {
  const mockUser = { name: 'test', email: 'test@email.com', password: 'test1234' };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('find user by email', () => {
    it('should return user with email', async () => {
      User.findOne = jest.fn().mockResolvedValue(mockUser);

      expect(User.findOne).not.toHaveBeenCalled();

      const response = await authService.findUserByEmail('email');

      expect(User.findOne).toHaveBeenCalled();
      expect(response).toEqual(mockUser);
    });
  });

  describe('hashPassword', () => {
    it('should return hashed password', async () => {
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('1234' as never);

      bcrypt.hash = jest.fn().mockResolvedValue('hashedPass');

      expect(bcrypt.hash).not.toHaveBeenCalled();

      const response = await authService.hashPassword(mockUser.password);

      expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.password, '1234');
      expect(response).toEqual('hashedPass');
    });
  });

  describe('validateRegisterationParams', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should throw error if details are not correct', async () => {
      const param = { name: 'test', password: 'invalid', email: 'invalid' };

      expect(authService.validateRegisterationParams.bind(this, param)).toThrow();
    });

    it('should return undefined on validating prams', () => {
      const response = authService.validateRegisterationParams(mockUser);

      expect(response).toBeUndefined();
    });
  });

  describe('validateRegisterationEmail', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should throw error if email is alredy in use', async () => {
      authService.findUserByEmail = jest.fn().mockReturnValue(true);

      expect(authService.validateRegisterationEmail('usedEmail')).rejects.toThrow();
    });

    it('should return undefined on successful validation', async () => {
      authService.findUserByEmail = jest.fn().mockReturnValue(false);

      const response = await authService.validateRegisterationEmail('usedEmail');

      expect(response).toBeUndefined();
    });
  });
});
