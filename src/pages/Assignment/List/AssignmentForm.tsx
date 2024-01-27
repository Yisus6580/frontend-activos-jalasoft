import { DatePicker } from '@mui/lab';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Theme,
  useTheme
} from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { ChangeEvent, FC, useState } from 'react';
import { IAssignment } from 'src/models/assignment';
import { IEmployee } from 'src/models/employee';
import * as yup from 'yup';

type AssignmentFormProps = {
  initialData: IAssignment;
  onSubmit(values: IAssignment, actions: FormikHelpers<IAssignment>): void;
  handleClose: () => void;
  isEdit: boolean;
  responsibles: IEmployee[];
};

const AssignmentForm: FC<AssignmentFormProps> = ({
  initialData,
  onSubmit,
  handleClose,
  isEdit,
  responsibles
}) => {
  const validationSchema = yup.object({
    actives: yup.array().required('Se requiere uno o varios activos'),
    details: yup
      .string()
      .min(5, 'El campo detalles debe tener al menos 5 caracteres')
      .required('Se requiere el campo detalles'),
    dateOfStart: yup.date().required('Se requiere el campo fecha de inicio'),
    dateOfEnd: yup.date().required('Se requiere el campo fecha de fin'),
    responsible: yup.string().required('Se requiere el campo responsable'),
    condition: yup.string().required('Se requiere el campo condición')
  });

  const formik = useFormik({
    initialValues: initialData,
    validationSchema: validationSchema,
    onSubmit: onSubmit
  });

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
      }
    }
  };

  const actives = [
    {
      _id: '12032012031',
      code: '309jf930',
      name: 'Mesa'
    },
    {
      _id: '232131242',
      code: '3423432',
      name: 'Silla'
    },
    {
      _id: '34324242',
      code: '53432423',
      name: 'Papel'
    },
    {
      _id: '5454654543',
      code: '45453',
      name: 'Teclado'
    },
    {
      _id: '3423423423',
      code: '435435',
      name: 'Monitor'
    }
  ];

  function getStyles(
    name: string,
    personName: readonly string[],
    theme: Theme
  ) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium
    };
  }
  const theme = useTheme();
  const [activeDocs, setactivesDoc] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof activeDocs>) => {
    const {
      target: { value }
    } = event;

    formik.setFieldValue('actives', value);
    setactivesDoc(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl
              fullWidth
              error={formik.touched.actives && Boolean(formik.errors.actives)}
            >
              <InputLabel id="label">Activos</InputLabel>
              <InputLabel>Activos</InputLabel>
              <Select
                id="actives"
                multiple
                value={activeDocs}
                onChange={handleChange}
                input={<OutlinedInput id="actives" label="Activos" />}
                renderValue={(selected) => {
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const active = actives.find((a) => a._id === value);
                        return (
                          <Chip
                            key={value}
                            label={`${active?.code} - ${active?.name}`}
                          />
                        );
                      })}
                    </Box>
                  );
                }}
                MenuProps={MenuProps}
              >
                {actives.map(({ _id, name, code }) => (
                  <MenuItem
                    key={_id}
                    value={`${_id}`}
                    style={getStyles(name, activeDocs, theme)}
                  >
                    {`${code} - ${name}`}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.actives && formik.errors.actives && (
                <FormHelperText>{formik.errors.actives}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Fecha de Inicio"
              value={formik.values.dateOfStart}
              onChange={(newValue) =>
                formik.setFieldValue('dateOfStart', newValue)
              }
              renderInput={(params) => (
                <TextField
                  id="dateOfStart"
                  name="dateOfStart"
                  error={
                    formik.touched.dateOfStart &&
                    Boolean(formik.errors.dateOfStart)
                  }
                  helperText={
                    formik.touched.dateOfStart && formik.errors.dateOfStart
                  }
                  fullWidth
                  {...params}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DatePicker
              label="Fecha de Fin"
              value={formik.values.dateOfEnd}
              onChange={(newValue) =>
                formik.setFieldValue('dateOfEnd', newValue)
              }
              renderInput={(params) => (
                <TextField
                  id="dateOfEnd"
                  name="dateOfEnd"
                  error={
                    formik.touched.dateOfEnd && Boolean(formik.errors.dateOfEnd)
                  }
                  helperText={
                    formik.touched.dateOfEnd && formik.errors.dateOfEnd
                  }
                  fullWidth
                  {...params}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="typeBox">Responable</InputLabel>
              <Select
                labelId="responsible"
                id="responsible"
                name="responsible"
                label="Responsable"
                value={formik.values.responsible}
                onChange={formik.handleChange}
                fullWidth
              >
                {responsibles.map((responsible) => (
                  <MenuItem key={responsible._id} value={responsible._id}>
                    {responsible.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="details"
              name="details"
              label="Detalles"
              type="text"
              value={formik.values.details}
              onChange={formik.handleChange}
              error={formik.touched.details && Boolean(formik.errors.details)}
              helperText={formik.touched.details && formik.errors.details}
              fullWidth
            />
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

export default AssignmentForm;
