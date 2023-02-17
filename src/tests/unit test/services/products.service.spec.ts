import mongoose from 'mongoose';
import { IProduct, Product } from '../../../models';
import { File, productsService } from '../../../services';
import cloudinary from '../../../utils/cloudinary.utils';
import { mockProduct } from '../../mocks';

describe('ProductsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('validateProductParams', () => {
    it('should throw error on invalid product details', () => {
      const product = { name: '', description: '', price: 1, countInStock: 1 };

      expect(productsService.validateProductParams.bind(this, product)).toThrow();
    });

    it('should return undefined on successfully validating product details', () => {
      const response = productsService.validateProductParams(mockProduct);

      expect(response).toBeUndefined();
    });
  });

  describe('uploadImage', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should throw error on unspecified image path', () => {
      expect(productsService.uploadImage.bind(this, '')).rejects.toThrow('Product image must be uploaded');
    });

    it('should return details of uploaded image', async () => {
      const imageDetails = {
        secure_url: 'secureUrl',
        public_id: 'public_id',
      };

      cloudinary.v2.uploader.upload = jest.fn().mockResolvedValue(imageDetails);

      const response = await productsService.uploadImage('imagePath');

      expect(response.url).toBe('secureUrl');
      expect(response.imageId).toBe('public_id');
    });

    it('should throw error on uploading image to cloudinary', async () => {
      cloudinary.v2.uploader.upload = jest.fn().mockRejectedValue(new Error());

      expect(productsService.uploadImage('imagePath')).rejects.toThrow('Error uploading image');
    });
  });

  describe('addProduct', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should add new product', async () => {
      const image = { url: '', imageId: '' };

      productsService.validateProductParams = jest.fn().mockReturnValue(null);
      productsService.uploadImage = jest.fn().mockResolvedValue(image);

      Product.create = jest.fn().mockResolvedValue(mockProduct);

      expect(Product.create).not.toHaveBeenCalled();

      const response = await productsService.addProduct(mockProduct, {} as File);

      expect(response.data).toEqual(mockProduct);
      expect(Product.create).toHaveBeenCalled();
    });
  });

  describe('getProducts', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return all products', async () => {
      Product.countDocuments = jest.fn().mockResolvedValue(1);

      const limit = jest.fn().mockResolvedValue([mockProduct]);
      const skip = jest.fn().mockReturnValue({ limit });
      const sort = jest.fn().mockReturnValue({ skip });
      Product.find = jest.fn().mockReturnValue({ sort });

      expect(Product.find).not.toHaveBeenCalled();

      const response = await productsService.getProducts();

      expect(response.data.totalProduct).toBe(1);
      expect(response.data.products).toEqual([mockProduct]);
      expect(Product.find).toHaveBeenCalled();
    });
  });

  describe('getProductById', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should throw error on invalid product id', () => {
      mongoose.isValidObjectId = jest.fn().mockReturnValue(false);

      expect(productsService.getProductById('id')).rejects.toThrow();
    });

    it('should throw product not found error if product does not exist', () => {
      mongoose.isValidObjectId = jest.fn().mockReturnValue(true);
      Product.findById = jest.fn().mockResolvedValue(null);

      expect(productsService.getProductById.bind(this, 'id')).rejects.toThrow('Product does not exist');
      expect(Product.findById).toHaveBeenCalled();
    });

    it('should return product', async () => {
      mongoose.isValidObjectId = jest.fn().mockReturnValue(true);

      Product.findById = jest.fn().mockResolvedValue(mockProduct);

      const response = await productsService.getProductById('id');

      expect(response).toEqual(mockProduct);
    });
  });

  describe('getProduct', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return product', async () => {
      productsService.getProductById = jest.fn().mockResolvedValue(mockProduct);

      expect(productsService.getProductById).not.toHaveBeenCalled();

      const response = await productsService.getProduct('id');

      expect(response.success).toBe(true);
      expect(response.data).toEqual(mockProduct);
      expect(productsService.getProductById).toHaveBeenCalledWith('id');
    });
  });

  describe('getProductByUrl', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should throw product not found error if product does not exist', () => {
      Product.findOne = jest.fn().mockResolvedValue(null);

      expect(productsService.getProductByUrl.bind(this, 'url')).rejects.toThrow('Product does not exist');
      expect(Product.findOne).toHaveBeenCalled();
    });

    it('should return product', async () => {
      Product.findOne = jest.fn().mockResolvedValue(mockProduct);

      const response = await productsService.getProductByUrl('url');

      expect(response).toEqual(mockProduct);
      expect(Product.findOne).toHaveBeenCalled();
    });
  });

  describe('updateProductImage', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should return new image details if file path is specified', async () => {
      const imageDetails = {
        secure_url: 'secureUrl',
        public_id: 'public_id',
      };

      cloudinary.v2.uploader.destroy = jest.fn().mockResolvedValue(null);

      cloudinary.v2.uploader.upload = jest.fn().mockResolvedValue(imageDetails);

      const response = await productsService.updateProductImage(
        { ...mockProduct, image: { url: '', imageId: '' } },
        'imagePath',
      );

      expect(response?.url).toBe('secureUrl');
      expect(response?.imageId).toBe('public_id');
    });

    it('should throw error on deleting or  uploading image to cloudinary', async () => {
      cloudinary.v2.uploader.destroy = jest.fn().mockRejectedValue(new Error());

      expect(
        productsService.updateProductImage({ ...mockProduct, image: { url: '', imageId: '' } }, 'imagePath'),
      ).rejects.toThrow('Error uploading image');
    });

    it('should return null if image update is not required', async () => {
      const response = await productsService.updateProductImage(mockProduct, '');

      expect(response).toBeFalsy();
    });
  });

  describe('updateProduct', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('it should update product', async () => {
      const product = {
        name: 'test',
        description: 'test',
        brand: 'test',
        price: 1,
        countInStock: 1,
        productUrl: 'test',
        image: {},
      } as IProduct;

      const save = jest.fn();

      productsService.validateProductParams = jest.fn().mockReturnValue(null);
      productsService.getProductById = jest.fn().mockResolvedValue({ ...product, save });
      productsService.updateProductImage = jest.fn().mockResolvedValue(null);

      expect(save).not.toHaveBeenCalled();

      const response = await productsService.updateProduct(product, 'productId');

      expect(response.success).toBe(true);
      expect(save).toHaveBeenCalled();
    });
  });

  describe('deleteProduct', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should delete product', async () => {
      const product = {
        name: 'test',
        description: 'test',
        price: 1,
        countInStock: 1,
        image: {},
      };

      const remove = jest.fn();

      productsService.getProductById = jest.fn().mockResolvedValue({ ...mockProduct, remove });
      cloudinary.v2.uploader.destroy = jest.fn().mockResolvedValue(null);

      expect(remove).not.toHaveBeenCalled();

      const response = await productsService.deleteProduct('id');

      expect(remove).toHaveBeenCalled();
      expect(response.success).toBe(true);
    });
  });
});
