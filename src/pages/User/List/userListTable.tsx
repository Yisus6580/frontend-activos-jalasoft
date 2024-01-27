import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton
} from '@mui/material';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import axios, { AxiosResponse } from 'axios';
import { FC, useEffect, useState } from 'react';
import { urlUser } from 'src/end-points';
import { IUser } from 'src/models/user';
import { useAppSelector } from 'src/redux/hook';
import DialogForm from 'src/components/DialogForm';
import UserForm from './UserForm';
import { convertUserToFormData } from 'src/utils';
import Swal from 'sweetalert2';

const UserListTable: FC = () => {
  const userColumns = [
    {
      field: 'fullName',
      headerName: 'Nombre Completo',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => <>{params.value}</>
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => <>{params.value}</>
    },
    {
      field: 'role',
      headerName: 'Rol',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <>{params.value === 'admin' ? 'Administrador' : 'Encargado'}</>
      )
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
      field: 'state',
      headerName: 'Estado',
      flex: 1,
      renderCell: (params: GridRenderCellParams) =>
        params.value ? (
          <Chip label="Activado" color="success" />
        ) : (
          <Chip label="Desactivado" color="warning" />
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
                await getUserById(params.value);
                handleClickOpen();
              }}
            >
              <CreateIcon />
            </IconButton>
            <IconButton
              aria-label={currentState ? 'Desactivar' : 'Activar'}
              color="inherit"
              onClick={() => setStateUser(params.value, currentState)}
            >
              {currentState ? <ClearIcon /> : <CheckIcon />}
            </IconButton>
          </>
        );
      }
    }
  ];

  const { sessionData } = useAppSelector((state) => state.auth);
  const [users, setUsers] = useState<IUser[]>([]);
  const [user, setUser] = useState<IUser>({
    fullName: '',
    email: '',
    password: '',
    role: 'admin',
    state: true
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
    setUser({
      fullName: '',
      email: '',
      password: '',
      role: 'admin',
      state: true
    });
  };

  const getListOfUsers = async () => {
    await axios
      .get(`${urlUser}`, {
        headers: {
          Authorization: `Bearer ${sessionData.token}`
        }
      })
      .then((response: AxiosResponse) => {
        setUsers(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUserById = async (id: string) => {
    await axios
      .get(`${urlUser}/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionData.token}`
        }
      })
      .then((response: AxiosResponse) => {
        const { data } = response.data;

        setUser({
          _id: data._id,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
          state: true,
          image: data.image?.url || ''
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createUser = async (user: IUser) => {
    const userMap = convertUserToFormData(user);

    await axios
      .post(`${urlUser}`, userMap, {
        headers: {
          Authorization: `Bearer ${sessionData.token}`
        }
      })
      .then(() => {
        getListOfUsers();
        handleClose();
        Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'Usuario creado correctamente',
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

  const editUser = async (user: IUser) => {
    const userMap = convertUserToFormData(user);

    await axios
      .put(`${urlUser}/${user._id}`, userMap, {
        headers: {
          Authorization: `Bearer ${sessionData.token}`
        }
      })
      .then(() => {
        getListOfUsers();
        handleClose();
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'Usuario actualizado correctamente',
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

  const setStateUser = (id: string, currentState: boolean) => {
    Swal.fire({
      title: currentState
        ? '¿Estas seguro de desactivar el registro?'
        : '¿Estas seguro de activar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .put(
            `${urlUser}/${id}`,
            { state: !currentState },
            {
              headers: {
                Authorization: `Bearer ${sessionData.token}`
              }
            }
          )
          .then((response: AxiosResponse) => {
            getListOfUsers();
            Swal.fire({
              title: currentState ? 'Desactivado' : 'Activado',
              text: currentState
                ? 'El registro ha sido desactivado'
                : 'El registro ha sido activado',
              icon: 'success',
              timer: 4000
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  useEffect(() => {
    getListOfUsers();
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
          columns={userColumns}
          rows={users}
          getRowId={(row) => row._id}
        />
        <DialogForm
          title={isEdit ? 'Editar Usuario' : 'Crear Usuario'}
          isOpen={isOpen}
          handleClose={handleClose}
        >
          <UserForm
            initialData={user}
            onSubmit={async (values) => {
              return isEdit ? editUser(values) : createUser(values);
            }}
            handleClose={handleClose}
            isEdit={isEdit}
          />
        </DialogForm>
      </CardContent>
    </Card>
  );
};

export default UserListTable;
