import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Typography
} from '@mui/material';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import axios, { AxiosResponse } from 'axios';
import { format } from 'date-fns';
import { FC, useEffect, useState } from 'react';
import DialogForm from 'src/components/DialogForm';
import { urlAssignment, urlEmployee } from 'src/end-points';
import { IAssignment } from 'src/models/assignment';
import { useAppSelector } from 'src/redux/hook';
import Swal from 'sweetalert2';
import AssignmentForm from './AssignmentForm';
import { IEmployee } from 'src/models/employee';

const AssignmentListTable: FC = () => {
  const assignmentColumns = [
    {
      field: 'actives',
      headerName: 'Activos Fijos',
      flex: 2,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap'
            }}
          >
            {params.value.map((active, index) => (
              <Typography key={index}>{active}</Typography>
            ))}
          </Box>
        );
      }
    },
    {
      field: 'details',
      headerName: 'Detalles',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => <>{params.value}</>
    },
    {
      field: 'dateOfStart',
      headerName: 'Fecha de Inicio',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <>{format(new Date(params.value), 'dd-MM-yyyy')}</>
      )
    },
    {
      field: 'dateOfEnd',
      headerName: 'Fecha de Fin',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <>{format(new Date(params.value), 'dd-MM-yyyy')}</>
      )
    },
    {
      field: 'responsible',
      headerName: 'Responsable',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => <>{params.value}</>
    },
    {
      field: 'condition',
      headerName: 'Condición',
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        if (params.value === 'finish') {
          return <Chip label="Finalizado" color="success" />;
        } else if (params.value === 'in_progress') {
          return <Chip label="En progreso" color="warning" />;
        }
      }
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
                await getAssignmentById(params.value);
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
  const [assignments, setAssignments] = useState<IAssignment[]>([]);
  const [responsibles, setResponsibles] = useState<IEmployee[]>([]);
  const [assignment, setAssignment] = useState<IAssignment>({
    actives: [],
    details: '',
    dateOfStart: null,
    dateOfEnd: null,
    responsible: null,
    condition: 'in_progress'
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
    setAssignment({
      actives: [],
      details: '',
      dateOfStart: null,
      dateOfEnd: null,
      responsible: null,
      condition: 'in_progress'
    });
  };

  const getListOfAssignment = async () => {
    await axios
      .get(`${urlAssignment}`, {
        headers: {
          Authorization: `Bearer ${sessionData.token}`
        }
      })
      .then((response: AxiosResponse) => {
        setAssignments(response.data.data);
      })
      .catch((error) => {
        console.log(error);
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
        setResponsibles(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAssignmentById = async (id: string) => {
    await axios
      .get(`${urlAssignment}/${id}`, {
        headers: {
          Authorization: `Bearer ${sessionData.token}`
        }
      })
      .then((response: AxiosResponse) => {
        const { data } = response.data;

        setAssignment(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createAssignment = async (assignment: IAssignment) => {
    await axios
      .post(`${urlAssignment}`, assignment, {
        headers: {
          Authorization: `Bearer ${sessionData.token}`
        }
      })
      .then(() => {
        getListOfAssignment();
        handleClose();
        Swal.fire({
          icon: 'success',
          title: 'Creado',
          text: 'Asiganción agregada correctamente',
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

  const editAssignment = async (assignment: IAssignment) => {
    await axios
      .put(`${urlAssignment}/${assignment._id}`, assignment, {
        headers: {
          Authorization: `Bearer ${sessionData.token}`
        }
      })
      .then(() => {
        getListOfAssignment();
        handleClose();
        Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'Asiganción actualizada correctamente',
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
    getListOfAssignment();
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
          columns={assignmentColumns}
          rows={assignments}
          getRowId={(row) => row._id}
        />
        <DialogForm
          title={isEdit ? 'Editar Asignación' : 'Crear Asignación'}
          isOpen={isOpen}
          handleClose={handleClose}
        >
          <AssignmentForm
            initialData={assignment}
            onSubmit={async (values) => {
              console.log(values);
              // return isEdit ? editAssignment(values) : createAssignment(values);
            }}
            handleClose={handleClose}
            isEdit={isEdit}
            responsibles={responsibles}
          />
        </DialogForm>
      </CardContent>
    </Card>
  );
};

export default AssignmentListTable;
