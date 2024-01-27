import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import { Avatar, Button, Card, CardContent, IconButton } from '@mui/material';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import axios, { AxiosResponse } from 'axios';
import { FC, useEffect, useState } from 'react';
import DialogForm from 'src/components/DialogForm';
import { urlEmployee } from 'src/end-points';
import { IEmployee } from 'src/models/employee';
import { IUser } from 'src/models/user';
import { useAppSelector } from 'src/redux/hook';
import { convertEmployeeToFormData } from 'src/utils';
import Swal from 'sweetalert2';
import EmployeeForm from './EmployeeForm';

const EmployeeListTable: FC = () => {
  const employeeColumns = [
    {
      field: 'name',
      headerName: 'Nombre',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => <>{params.value}</>
    },
    {
      field: 'lastName',
      headerName: 'Apellidos',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => <>{params.value}</>
    },
    {
      field: 'CI',
      headerName: 'CI',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => <>{params.value}</>
    },
    {
      field: 'address',
      headerName: 'Dirección',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => <>{params.value}</>
    },
    {
      field: 'numberOfPhone',
      headerName: 'Número de Teléfono',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => <>{params.value}</>
    },
    {
      field: 'position',
      headerName: 'Cargo',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => <>{params.value}</>
    },
    {
      field: 'image',
      headerName: 'Imagen',
      flex: 1,
      renderCell: (params: GridRenderCellParams<IUser>) => (
        <Avatar src={params.value ? params.value.url : null} />
      )
    },
    {
      field: '_id',
      headerName: 'Opciones',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        const currentState = params.row.state;
        return (
          <>
            <IconButton
              aria-label="Editar"
              color="inherit"
              onClick={async () => {
                setIsEdit(true);
                await getEmployeeById(params.value);
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
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [employee, setEmployee] = useState<IEmployee>({
    name: '',
    lastName: '',
    CI: '',
    address: '',
    numberOfPhone: '',
    position: ''
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
    setEmployee({
      name: '',
      lastName: '',
      CI: '',
      address: '',
      numberOfPhone: '',
      position: ''
    });
  };

  const getListOfEmployee = async () => {
    await axios
      .get(`${urlEmployee}`, {
        headers: {
          Authorization: `Bearer ${sessionData.token}`
        }
      })
      .then((response: AxiosResponse) => {
        setEmployees(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getEmployeeById = async (id: string) => {
    await axios
      .get(`${urlEmployee}/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionData.token}`
        }
      })
      .then((response: AxiosResponse) => {
        const { data } = response.data;

        setEmployee({
          _id: data._id,
          name: data.name,
          lastName: data.lastName,
          CI: data.CI,
          address: data.address,
          numberOfPhone: data.numberOfPhone,
          position: data.position,
          image: data.image?.url || ''
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createEmployee = async (employee: IEmployee) => {
    const employeeMap = convertEmployeeToFormData(employee);

    await axios
      .post(`${urlEmployee}`, employeeMap, {
        headers: {
          Authorization: `Bearer ${sessionData.token}`
        }
      })
      .then(() => {
        getListOfEmployee();
        handleClose();
        Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'Empleado creado correctamente',
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

  const editEmployee = async (employee: IEmployee) => {
    const employeeMap = convertEmployeeToFormData(employee);

    await axios
      .put(`${urlEmployee}/${employee._id}`, employeeMap, {
        headers: {
          Authorization: `Bearer ${sessionData.token}`
        }
      })
      .then(() => {
        getListOfEmployee();
        handleClose();
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'Empleado actualizado correctamente',
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
    getListOfEmployee();
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
          columns={employeeColumns}
          rows={employees}
          getRowId={(row) => row._id}
        />
        <DialogForm
          title={isEdit ? 'Editar Empleado' : 'Crear Empleado'}
          isOpen={isOpen}
          handleClose={handleClose}
        >
          <EmployeeForm
            initialData={employee}
            onSubmit={async (values) => {
              return isEdit ? editEmployee(values) : createEmployee(values);
            }}
            handleClose={handleClose}
            isEdit={isEdit}
          />
        </DialogForm>
      </CardContent>
    </Card>
  );
};

export default EmployeeListTable;
