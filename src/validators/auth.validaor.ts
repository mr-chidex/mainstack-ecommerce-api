import Joi from 'joi';

import { IUser } from '../models';

export const validateRegisterParams = (registerParams: IUser) => {
  return Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().required().email().normalize(),
    password: Joi.string().min(5).trim().required(),
  }).validate(registerParams);
};

export const validateLoginParams = (loginParams: IUser) => {
  return Joi.object({
    email: Joi.string().required().email().normalize(),
    password: Joi.string().trim().required(),
  }).validate(loginParams);
};
