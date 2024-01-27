import { ConditionType } from './global-types';

export type ILicense = {
  _id?: string;
  name: string;
  description?: string;
  keyProduct: string;
  dateOfPurchase: Date;
  expiration: ILicenseExpiration;
  price: number;
  isReusable: boolean;
  condition: ConditionType;
};

interface ILicenseExpiration {
  isExpires: boolean;
  dateOfExpiration?: Date;
}
