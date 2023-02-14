import { Err } from '../handlers';

export const errorResponse = (message: string, code: number = 400) => {
  const error: Err = new Error(message);
  error.statusCode = code;
  throw error;
};
