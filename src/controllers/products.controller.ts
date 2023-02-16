import { Request, Response } from 'express';

import { productsService } from '../services';

class ProductsController {
  async addNewProduct(req: Request, res: Response) {
    const response = await productsService.addProduct(req.body);
    return res.status(201).json({ ...response });
  }
}

export const productsController = new ProductsController();
