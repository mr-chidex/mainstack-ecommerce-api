import { IProduct, Products } from '../models';
import { errorResponse } from '../utils';
import { validateProductParams } from '../validators';

class ProductsService {
  async addProduct(body: IProduct) {
    const { error } = validateProductParams(body);
    if (error) {
      return errorResponse(error.details[0].message, 400);
    }

    const { name, description, brand, price, countInStock } = body;

    // upload product image to cloudinary
    // yet to do

    const product = new Products({
      name,
      image: {},
      description,
      brand,
      price,
      countInStock,
    });
    await product.save();

    return {
      success: true,
      message: 'Product successfully added',
      data: product,
    };
  }
}

export const productsService = new ProductsService();
