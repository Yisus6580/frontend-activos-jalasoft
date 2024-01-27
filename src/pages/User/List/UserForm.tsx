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
import { IUser } from 'src/models/user';
import Swal from 'sweetalert2';
import * as yup from 'yup';

type UserFormProps = {
  initialData: IUser;
  onSubmit(values: IUser, actions: FormikHelpers<IUser>): void;
  handleClose: () => void;
  isEdit: boolean;
};

const UserForm: FC<UserFormProps> = ({
  initialData,
  onSubmit,
  handleClose,
  isEdit
}) => {
  const validationSchema = yup.object({
    fullName: yup
      .string()
      .min(3, 'El campo nombre completo debe tener al menos 3 caracteres')
      .required('Se requiere el campo nombre completo'),
    email: yup
      .string()
      .email('El campo dirección de correo electrónico es invalido')
      .required('Se requiere el campo dirección de correo electrónico'),
    password: isEdit
      ? null
      : yup
          .string()
          .min(8, 'El campo contraseña debe tener al menos 8 caracteres')
          .required('Se requiere el campo contraseña')
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
          <Grid item xs={12}>
            <TextField
              id="fullName"
              name="fullName"
              label="Nombre Completo"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="email"
              name="email"
              label="Correo Electrónico"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              fullWidth
            />
          </Grid>
          {isEdit ? null : (
            <Grid item xs={12}>
              <TextField
                id="password"
                name="password"
                label="Contraseña"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                fullWidth
              />
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="role">Rol</InputLabel>
              <Select
                labelId="role"
                id="role"
                name="role"
                label="Rol"
                value={formik.values.role}
                onChange={formik.handleChange}
                fullWidth
              >
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="attendant">Encargado</MenuItem>
              </Select>
            </FormControl>
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

export default UserForm;
