import { ImageType } from './global-types';

export interface IUser {
  _id?: string;
  fullName: string;
  email: string;
  password?: string;
  role: TypeRols;
  image?: ImageType;
  token?: string;
  verifyToken?: string;
  state: boolean;
}

type TypeRols = 'admin' | 'attendant';

export interface SessionData {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  state: boolean;
  image: ImageType;
  token: string;
}

export type Credentials = {
  email: string;
  password: string;
};
