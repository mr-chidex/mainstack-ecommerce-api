import { Request, Response } from 'express';

import { productsService } from '../services';

class ProductsController {
  //@POST
  async addNewProduct(req: Request, res: Response) {
    const response = await productsService.addProduct(req.body, req.file);
    res.status(201).json({ ...response });
  }

  //@GET
  async getAllProduct(req: Request, res: Response) {
    const response = await productsService.getProducts(req.query);
    res.status(200).json({ ...response });
  }

  //@GET
  async getProduct(req: Request, res: Response) {
    const response = await productsService.getProduct(req.params?.id);
    res.status(200).json({ ...response });
  }

  //@PATCH
  async updateProduct(req: Request, res: Response) {
    const response = await productsService.updateProduct(req.body, req.params?.id, req.file);
    res.status(200).json({ ...response });
  }

  //@DELETE
  async deleteProduct(req: Request, res: Response) {
    const response = await productsService.deleteProduct(req.params?.id);
    res.status(200).json({ ...response });
  }
}

export const productsController = new ProductsController();
