import { useEffect, useState } from "react";
import useSWR from "swr";

import { Grid, MenuItem, Select } from "@mui/material";
import { PeopleOutline } from "@mui/icons-material"

import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

import { AdminLayout } from "../../components/layouts"
import { IUser } from "../../interfaces";
import tesloApi from '../../api/tesloApi';

const UsersPage = () => {

  const { data, error } = useSWR<IUser[]>('/api/admin/users');

  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data])
  

  if ( !data && !error) return (<></>);

  const onRoleUpdated = async ( userId: string, newRole: string ) => {
    
    const previousUsers = users.map( user => ({ ...user }));
    const updatedUsers = users.map( user => ({
      ...user,
      role: userId === user._id ? newRole : user.role
    }))

    setUsers(updatedUsers);

    try {

      await tesloApi.put('/admin/users', { userId, role: newRole });

    } catch (error) {
      setUsers(previousUsers);
      alert('No se pudo actualizar el rol del usuario');
      console.log(error);
    }

  }

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre completo', width: 300 },
    {
      field: 'role',
      headerName: 'Rol',
      width: 250,
      renderCell: ({row}: GridValueGetterParams) =>{
        return (
          <Select
            value={ row.role }
            label='Rol'
            onChange={ ({ target }) => onRoleUpdated( row.id, target.value) }
            sx={{ width: '250px' }}
          >
            <MenuItem value='admin'>Admin</MenuItem>
            <MenuItem value='client'>Cliente</MenuItem>
            <MenuItem value='super-user'>Superusuario</MenuItem>
            <MenuItem value='seo'>SEO</MenuItem>
          </Select>
        )
      }
    },
  ];

  const rows = users.map( user => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role
  }))

  return (
    <AdminLayout
      title='Usuarios'
      subTitle='Listado de usuarios'
      icon={ <PeopleOutline /> }
    >

      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>

          <DataGrid
            columns={columns}
            rows={rows}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />

        </Grid>
      </Grid>

    </AdminLayout>
  )
}

export default UsersPage