import { productsService } from '../../../services';
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
});
