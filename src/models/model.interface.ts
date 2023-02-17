export interface IUser {
  _id?: string;
  name?: string;
  email: string;
  isAdmin?: boolean;
  password: string;
}

interface Image {
  url: string;
  imageId: string;
}

export interface IProduct {
  _id?: string;
  name: string;
  image: Image;
  brand?: string;
  description: string;
  rating?: number;
  price: number;
  countInStock: number;
  productUrl?: string;
}
