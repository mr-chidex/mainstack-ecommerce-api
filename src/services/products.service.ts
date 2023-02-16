import { logger } from '../handlers';
import { IProduct, Products } from '../models';
import { errorResponse } from '../utils';
import cloudinary from '../utils/cloudinary.utils';
import { validateProductParams } from '../validators';
import { File } from './service.interface';

class ProductsService {
  async addProduct(body: IProduct, file: File) {
    const { error } = validateProductParams(body);
    if (error) {
      return errorResponse(error.details[0].message, 400);
    }

    const { name, description, brand, price, countInStock } = body;

    // upload product image to cloudinary
    const image = await this.uploadImage(file?.path);

    const product = new Products({
      name,
      image,
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

  async uploadImage(path: string | undefined) {
    if (!path) return errorResponse('Product image must be uploaded', 400);

    try {
      const uploadedImage = await cloudinary.v2.uploader.upload(path);

      return {
        url: uploadedImage.secure_url,
        imageId: uploadedImage.public_id,
      };
    } catch (err: any) {
      logger.log('error', `Error uploading image: ${err?.message}`);
      return errorResponse('Error uploading image', 400);
    }
  }
}

export const productsService = new ProductsService();
