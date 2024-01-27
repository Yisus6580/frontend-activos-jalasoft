import {
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { ChangeEvent, FC, useState } from 'react';
import { IEmployee } from 'src/models/employee';
import Swal from 'sweetalert2';
import * as yup from 'yup';

type EmployeeFormProps = {
  initialData: IEmployee;
  onSubmit(values: IEmployee, actions: FormikHelpers<IEmployee>): void;
  handleClose: () => void;
  isEdit: boolean;
};

const EmployeeForm: FC<EmployeeFormProps> = ({
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
    lastName: yup
      .string()
      .min(3, 'El campo apellido debe tener al menos 3 caracteres')
      .required('Se requiere el campo apellido'),
    CI: yup
      .string()
      .min(7, 'El campo CI debe tener al menos 7 caracteres')
      .required('Se requiere el campo CI'),
    address: yup
      .string()
      .min(5, 'El campo dirección debe tener al menos 5 caracteres')
      .required('Se requiere el campo dirección'),
    numberOfPhone: yup
      .string()
      .min(8, 'El campo dirección debe tener al menos 8 caracteres'),
    position: yup.string().required('Se requiere el campo cargo')
  });

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: validationSchema,
    onSubmit: onSubmit
  });
  const [selectedImage, setSelectedImage] = useState<string>(
    initialData.image as any
  );

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const maxSize = 1024 * 1024 * 3;
    if (event.currentTarget.files[0].size > maxSize) {
      event.target.value = '';
      return Swal.fire({
        icon: 'error',
        title: 'Formato Invalido',
        text: 'El tamaño de la imagen supera los 3MB',
        timer: 4000,
        customClass: {
          container: 'my-swal2-container'
        }
      });
    }

    if (event.currentTarget.files) {
      let file = event.currentTarget.files[0];
      if (file) {
        if (
          file.type === 'image/jpeg' ||
          file.type === 'image/jpg' ||
          file.type === 'image/png'
        ) {
          const reader = new FileReader();
          reader.onload = () => {
            setSelectedImage(reader.result as string);
          };
          reader.readAsDataURL(file);
          formik.setFieldValue('image', event.currentTarget.files?.[0]);
        } else {
          event.target.value = '';
          Swal.fire({
            icon: 'error',
            title: 'Formato Invalido',
            text: 'Solo se acepa los formatos de imagen .jpg y .png',
            timer: 4000,
            customClass: {
              container: 'my-swal2-container'
            }
          });
        }
      }
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={6}>
            <TextField
              id="lastName"
              name="lastName"
              label="Apellidos"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              id="CI"
              name="CI"
              label="CI"
              value={formik.values.CI}
              onChange={formik.handleChange}
              error={formik.touched.CI && Boolean(formik.errors.CI)}
              helperText={formik.touched.CI && formik.errors.CI}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              id="address"
              name="address"
              label="Dirección"
              value={formik.values.address}
              onChange={formik.handleChange}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="numberOfPhone"
              name="numberOfPhone"
              label="Número de teléfono"
              value={formik.values.numberOfPhone}
              onChange={formik.handleChange}
              error={
                formik.touched.numberOfPhone &&
                Boolean(formik.errors.numberOfPhone)
              }
              helperText={
                formik.touched.numberOfPhone && formik.errors.numberOfPhone
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="position"
              name="position"
              label="Cargo"
              value={formik.values.position}
              onChange={formik.handleChange}
              error={formik.touched.position && Boolean(formik.errors.position)}
              helperText={formik.touched.position && formik.errors.position}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            {selectedImage && (
              <Grid item xs={12}>
                <Avatar
                  alt="Preview"
                  src={selectedImage}
                  sx={{ width: 100, height: 100, mb: 2 }}
                />
              </Grid>
            )}
            <input
              accept=".jpg,.jpeg,.png"
              style={{ display: 'none' }}
              name="image"
              id="image"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="image">
              <Button variant="contained" color="primary" component="span">
                Cargar imagen
              </Button>
            </label>
          </Grid>
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

export default EmployeeForm;
