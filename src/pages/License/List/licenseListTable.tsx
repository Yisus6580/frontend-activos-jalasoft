import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import { Button, Card, CardContent, Chip, IconButton } from '@mui/material';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import axios, { AxiosResponse } from 'axios';
import { format } from 'date-fns';
import { FC, useEffect, useState } from 'react';
import DialogForm from 'src/components/DialogForm';
import { urlLicense } from 'src/end-points';
import { ILicense } from 'src/models/license';
import { useAppSelector } from 'src/redux/hook';
import { convertLicenseToFormData } from 'src/utils';
import Swal from 'sweetalert2';
import LicenseForm from './LicenseForm';

const LicenseListTable: FC = () => {
  const licenseColumns = [
    {
      field: 'name',
      headerName: 'Nombre',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => <>{params.value}</>
    },
    {
      field: 'description',
      headerName: 'Descripción',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => <>{params.value}</>
    },
    {
      field: 'keyProduct',
      headerName: 'Clave',
      flex: 2,
      renderCell: (params: GridRenderCellParams) => <>{params.value}</>
    },
    {
      field: 'dateOfPurchase',
      headerName: 'Fecha de Compra',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <>{format(new Date(params.value), 'dd-MM-yyyy')}</>
      )
    },
    {
      field: 'price',
      headerName: 'Precio (Bs)',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => <>{params.value}</>
    },
    {
      field: 'isReusable',
      headerName: 'Reutilizable',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        return params.value ? 'Si' : 'No';
      }
    },
    {
      field: 'condition',
      headerName: 'Condición',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        if (params.value === 'available') {
          return <Chip label="Disponible" color="success" />;
        } else if (params.value === 'used') {
          return <Chip label="Usada" color="warning" />;
        } else if (params.value === 'expired') {
          return <Chip label="Expirada" color="error" />;
        }
      }
    },
    {
      field: 'expiration',
      headerName: 'Fecha de Expiración',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <>
          {params.value.isExpires
            ? format(new Date(params.value.dateOfExpiration), 'dd-MM-yyyy')
            : 'Sin expiración'}
        </>
      )
    },
    {
      field: '_id',
      headerName: 'Opciones',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>
            <IconButton
              aria-label="Editar"
              color="inherit"
              onClick={async () => {
                setIsEdit(true);
                await getLicenseById(params.value);
                handleClickOpen();
              }}
            >
              <CreateIcon />
            </IconButton>
          </>
        );
      }
    }
  ];

  const { sessionData } = useAppSelector((state) => state.auth);
  const [licenses, setLicenses] = useState<ILicense[]>([]);
  const [license, setLicense] = useState<ILicense>({
    name: '',
    description: '',
    keyProduct: '',
    dateOfPurchase: null,
    expiration: {
      isExpires: false,
      dateOfExpiration: null
    },
    price: 0,
    isReusable: false,
    condition: 'available'
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleClickOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    handleClean();
  };

  const handleClean = () => {
    setLicense({
      name: '',
      description: '',
      keyProduct: '',
      dateOfPurchase: null,
      expiration: {
        isExpires: false,
        dateOfExpiration: null
      },
      price: 0,
      isReusable: false,
      condition: 'available'
    });
  };

  const getListOfLicense = async () => {
    await axios
      .get(`${urlLicense}`, {
        headers: {
          Authorization: `Bearer ${sessionData.token}`
        }
      })
      .then((response: AxiosResponse) => {
        setLicenses(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getLicenseById = async (id: string) => {
    await axios
      .get(`${urlLicense}/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionData.token}`
        }
      })
      .then((response: AxiosResponse) => {
        const { data } = response.data;

        setLicense(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createLicense = async (license: ILicense) => {
    await axios
      .post(`${urlLicense}`, license, {
        headers: {
          Authorization: `Bearer ${sessionData.token}`
        }
      })
      .then(() => {
        getListOfLicense();
        handleClose();
        Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'Licencia agregada correctamente',
          timer: 4000
        });
      })
      .catch((error) => {
        handleClose();
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
          timer: 4000
        });
      });
  };

  const editLicense = async (license: ILicense) => {
    await axios
      .put(`${urlLicense}/${license._id}`, license, {
        headers: {
          Authorization: `Bearer ${sessionData.token}`
        }
      })
      .then(() => {
        getListOfLicense();
        handleClose();
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'Licencia actualizada correctamente',
          timer: 4000
        });
      })
      .catch((error) => {
        handleClose();
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
          timer: 4000
        });
      });
  };

  useEffect(() => {
    getListOfLicense();
  }, []);

  return (
    <Card>
      <CardContent>
        <Button
          onClick={() => {
            setIsEdit(false);
            handleClickOpen();
          }}
          startIcon={<AddIcon />}
          variant="contained"
          color="success"
          sx={{ mb: 2 }}
        >
          Agregar
        </Button>
        <DataGrid
          columns={licenseColumns}
          rows={licenses}
          getRowId={(row) => row._id}
        />
        <DialogForm
          title={isEdit ? 'Editar Licencia' : 'Crear Licencia'}
          isOpen={isOpen}
          handleClose={handleClose}
        >
          <LicenseForm
            initialData={license}
            onSubmit={async (values) => {
              return isEdit ? editLicense(values) : createLicense(values);
            }}
            handleClose={handleClose}
            isEdit={isEdit}
          />
        </DialogForm>
      </CardContent>
    </Card>
  );
};

export default LicenseListTable;
