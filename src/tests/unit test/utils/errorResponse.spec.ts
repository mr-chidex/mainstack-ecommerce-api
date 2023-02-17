import { errorResponse } from '../../../utils';

describe('errorResponse', () => {
  it('should throw error', () => {
    expect(errorResponse.bind(this, 'message', 400)).toThrow();
  });
});
