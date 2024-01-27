import { ImageType } from './global-types';

export interface IEmployee {
  _id?: string;
  name: string;
  lastName: string;
  CI: string;
  address: string;
  numberOfPhone?: string;
  position: string;
  image?: ImageType;
}
