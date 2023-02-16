import Joi from 'joi';

import { IProduct } from '../models';

export const validateProductParams = (params: IProduct) => {
  return Joi.object({
    name: Joi.string().trim().required(),
    brand: Joi.optional(),
    description: Joi.string().trim().required(),
    rating: Joi.optional(),
    price: Joi.number().required(),
    countInStock: Joi.optional(),
  }).validate(params);
};
