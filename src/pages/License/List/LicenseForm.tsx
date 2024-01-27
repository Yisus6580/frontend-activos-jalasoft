import { DatePicker } from '@mui/lab';
import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { ChangeEvent, FC } from 'react';
import { ILicense } from 'src/models/license';
import * as yup from 'yup';

type UserFormProps = {
  initialData: ILicense;
  onSubmit(values: ILicense, actions: FormikHelpers<ILicense>): void;
  handleClose: () => void;
  isEdit: boolean;
};

const LicenseForm: FC<UserFormProps> = ({
  initialData,
  onSubmit,
  handleClose,
  isEdit
}) => {
  const validationSchema = yup.object({
    name: yup
      .string()
      .min(3, 'El campo nombre debe tener al menos 3 caracteres')
      .required('Se requiere el campo nombre'),
    description: yup
      .string()
      .min(10, 'El campo descripción debe tener al menos 10 caracteres'),
    keyProduct: yup.string().required('Se requiere el campo clave'),
    dateOfPurchase: yup.date().required('Se requiere el campo fecha de compra'),
    price: yup.number(),
    condition: yup.string().required('Se requiere el campo condición'),
    expiration: yup.object({
      isExpires: yup.boolean(),
      dateOfExpiration: yup
        .date()
        .nullable()
        .test(
          'isExpires',
          'Se requiere el campo fecha de expiración',
          function (value) {
            const isExpires = this.parent.isExpires;
            return isExpires ? Boolean(value) : true;
          }
        )
    })
  });

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: validationSchema,
    onSubmit: onSubmit
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              id="name"
              name="name"
              label="Nombre"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="description"
              name="description"
              label="Descripción"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="keyProduct"
              name="keyProduct"
              label="Clave"
              value={formik.values.keyProduct}
              onChange={formik.handleChange}
              error={
                formik.touched.keyProduct && Boolean(formik.errors.keyProduct)
              }
              helperText={formik.touched.keyProduct && formik.errors.keyProduct}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="price"
              name="price"
              label="Precio (Bs)"
              type="number"
              value={formik.values.price}
              onChange={formik.handleChange}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="typeBox">Tipo</InputLabel>
              <Select
                labelId="condition"
                id="condition"
                name="condition"
                label="Condición"
                value={formik.values.condition}
                onChange={formik.handleChange}
                fullWidth
              >
                <MenuItem value="available">Disponible</MenuItem>
                <MenuItem value="used">Usado</MenuItem>
                <MenuItem value="expired">Expirado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <DatePicker
              label="Fecha de Compra"
              value={formik.values.dateOfPurchase}
              onChange={(newValue) =>
                formik.setFieldValue('dateOfPurchase', newValue)
              }
              renderInput={(params) => (
                <TextField
                  id="dateOfPurchase"
                  name="dateOfPurchase"
                  error={
                    formik.touched.dateOfPurchase &&
                    Boolean(formik.errors.dateOfPurchase)
                  }
                  helperText={
                    formik.touched.dateOfPurchase &&
                    formik.errors.dateOfPurchase
                  }
                  fullWidth
                  {...params}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={<Checkbox checked={formik.values.isReusable} />}
              name="isReusable"
              id="isReusable"
              label="Reusable"
              value={formik.values.isReusable}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox checked={formik.values.expiration.isExpires} />
              }
              name="expiration.isExpires"
              id="isExpires"
              label="Expirable"
              value={formik.values.expiration.isExpires}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                formik.handleChange(e);
                formik.setFieldValue('expiration.isExpires', e.target.checked);
                if (!e.target.checked) {
                  formik.setFieldValue('expiration.dateOfExpiration', null);
                }
              }}
            />
          </Grid>
          {formik.values.expiration.isExpires && (
            <Grid item xs={12}>
              <DatePicker
                label="Fecha de Expiración"
                value={formik.values.expiration.dateOfExpiration}
                onChange={(newValue) =>
                  formik.setFieldValue('expiration.dateOfExpiration', newValue)
                }
                renderInput={(params) => (
                  <TextField
                    id="dateOfExpiration"
                    name="dateOfExpiration"
                    error={
                      formik.touched.expiration?.dateOfExpiration &&
                      Boolean(formik.errors.expiration?.dateOfExpiration)
                    }
                    helperText={
                      formik.touched.expiration?.dateOfExpiration &&
                      formik.errors.expiration?.dateOfExpiration
                    }
                    fullWidth
                    {...params}
                  />
                )}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={() => handleClose()}>
          Cancelar
        </Button>
        <Button type="submit">Aceptar</Button>
      </DialogActions>
    </form>
  );
};

export default LicenseForm;
