export type File = Express.Multer.File | undefined;

export interface JWTTOKEN {
  userId: string;
  iss: string;
  iat: number;
}
