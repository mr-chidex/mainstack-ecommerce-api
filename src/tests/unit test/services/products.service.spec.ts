import { Product } from '../../../models';
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
});
