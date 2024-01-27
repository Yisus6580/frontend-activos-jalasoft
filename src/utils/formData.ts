import { IEmployee } from 'src/models/employee';
import { ILicense } from 'src/models/license';
import { IUser } from 'src/models/user';

export const convertUserToFormData = (user: IUser): FormData => {
  const formData = new FormData();

  if (user.fullName) {
    formData.append('fullName', user.fullName);
  }

  if (user.email) {
    formData.append('email', user.email);
  }

  if (user.password) {
    formData.append('password', user.password);
  }

  if (typeof user.image === 'object') {
    if (user.image) {
      formData.append('image', user.image as any);
    }
  }

  if (user.role) {
    formData.append('role', user.role);
  }
  formData.append('state', user.state.toString());

  return formData;
};

export const convertLicenseToFormData = (license: ILicense): FormData => {
  const formData = new FormData();

  if (license.name) {
    formData.append('name', license.name);
  }

  if (license.description) {
    formData.append('description', license.description);
  }

  if (license.keyProduct) {
    formData.append('keyProduct', license.keyProduct);
  }

  if (license.dateOfPurchase) {
    formData.append('dateOfPurchase', formatDate(license.dateOfPurchase));
  }

  if (license.price) {
    formData.append('price', license.price.toString());
  }

  formData.append('isReusable', license.isReusable.toString());

  if (license.condition) {
    formData.append('condition', license.condition);
  }

  if (license.expiration) {
    formData.append('expiration', license.expiration as any);
  }

  return formData;
};

export const convertEmployeeToFormData = (employee: IEmployee): FormData => {
  const formData = new FormData();

  if (employee.name) {
    formData.append('name', employee.name);
  }

  if (employee.lastName) {
    formData.append('lastName', employee.lastName);
  }

  if (employee.CI) {
    formData.append('CI', employee.CI);
  }

  if (employee.address) {
    formData.append('address', employee.address);
  }

  if (employee.numberOfPhone) {
    formData.append('numberOfPhone', employee.numberOfPhone);
  }

  if (employee.position) {
    formData.append('position', employee.position);
  }

  if (typeof employee.image === 'object') {
    if (employee.image) {
      formData.append('image', employee.image as any);
    }
  }

  return formData;
};

const formatDate = (date: Date) => {
  date = new Date(date);

  const format = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const [{ value: month }, , { value: day }, , { value: year }] =
    format.formatToParts(date);
  return `${year}-${month}-${day}`;
};
