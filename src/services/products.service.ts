import mongoose from 'mongoose';
import slugify from 'slugify';

import { logger } from '../handlers';
import { IProduct, Product } from '../models';
import { errorResponse } from '../utils';
import cloudinary from '../utils/cloudinary.utils';
import { validateProductParams } from '../validators';
import { File } from './service.interface';

class ProductsService {
  validateProductParams(body: IProduct) {
    const { error } = validateProductParams(body);
    if (error) {
      return errorResponse(error.details[0].message, 400);
    }
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

  async addProduct(body: IProduct, file: File) {
    this.validateProductParams(body);

    const { name, description, brand, price, countInStock } = body;

    // upload product image to cloudinary
    const image = await this.uploadImage(file?.path);

    const product = await Product.create({
      name,
      image,
      description,
      brand,
      price,
      countInStock,
      productUrl: slugify(name, { lower: true, strict: true }), //creating a url for the product,
    });

    return {
      success: true,
      message: 'Product successfully added',
      data: product,
    };
  }

  async getProducts(query?: any) {
    const total = await Product.countDocuments();
    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.offset) || total;
    const start = (page - 1) * limit;

    const products = await Product.find().sort({ _id: -1 }).skip(start).limit(limit);

    return {
      success: true,
      message: 'Success',
      data: { totalProduct: total, products },
    };
  }

  async getProductById(productId: string) {
    if (!mongoose.isValidObjectId(productId)) {
      return errorResponse('invalid product id', 400);
    }

    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse('Product does not exist', 404);
    }

    return product;
  }

  async getProduct(productId: string) {
    const product = await this.getProductById(productId);

    return {
      success: true,
      message: 'Success',
      data: product,
    };
  }

  async getProductByUrl(productUrl: string) {
    const product = await Product.findOne({ productUrl });
    if (!product) {
      return errorResponse('Product does not exist', 404);
    }

    return product;
  }

  async updateProductImage(product: IProduct, path: string | undefined) {
    if (path) {
      try {
        //delete old image
        product.image.imageId && (await cloudinary.v2.uploader.destroy(product.image.imageId));

        //upload new image
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
    return null;
  }

  async updateProduct(body: IProduct, productId: string, file?: File) {
    this.validateProductParams(body);

    const { name, description, brand, price, countInStock } = body;

    const product = await this.getProductById(productId);

    product.name = name || product.name;
    product.description = description || product.description;
    product.brand = brand || product.brand;
    product.price = price || product.price;
    product.countInStock = countInStock || product.countInStock;
    product.productUrl = slugify(product.name, { lower: true, strict: true });

    const image = await this.updateProductImage(product, file?.path);
    product.image = image || product.image;

    await product.save();

    return {
      success: true,
      message: 'Product successfully updated',
      date: product,
    };
  }

  async deleteProduct(productId: string) {
    const product = await this.getProductById(productId);

    //delete image
    product.image?.imageId && (await cloudinary.v2.uploader.destroy(product.image.imageId));

    await product.remove();

    return {
      success: true,
      message: 'Product successfully deleted',
    };
  }
}

export const productsService = new ProductsService();
