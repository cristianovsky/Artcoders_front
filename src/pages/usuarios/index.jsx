import React, { useEffect } from 'react';
import { useUser } from 'context/userContext';
import { useQuery } from '@apollo/client';
import { GET_USUARIOS } from 'graphql/usuarios/queries';
import { GET_USUARIOSNOPENDIENTE } from 'graphql/usuarios/queries';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Enum_Rol, Enum_EstadoUsuario } from 'utils/enums';
import PrivateRoute from 'components/PrivateRoute';

const IndexUsuarios = () => {
const {userData} = useUser();
const { data, error, loading } = useQuery((userData.rol ==='ADMINISTRADOR')?GET_USUARIOS:GET_USUARIOSNOPENDIENTE)


  useEffect(() => {
    if (error) {
      toast.error('Error consultando los usuarios');
    }
  }, [error]);

  if (loading) return <div>Cargando....</div>;

  return (
    <PrivateRoute roleList={userData.rol}>
      <div>
       <h1 class="text-center text-3xl font-extrabold text-indigo-700">Datos Usuarios</h1>
        <table className='tabla'>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellidos</th>
              <th>Correo</th>
              <th>Identificación</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {userData.rol==='ADMINISTRADOR' ? (
              <>
                {data.Usuarios.map((u) => {
                  return (
                    <tr key={u._id}>
                      <td>{u.nombre}</td>
                      <td>{u.apellido}</td>
                      <td>{u.correo}</td>
                      <td>{u.identificacion}</td>
                      <td>{Enum_Rol[u.rol]}</td>
                      <td>{Enum_EstadoUsuario[u.estado]}</td>
                      <td>
                        <Link to={`/usuarios/editar/${u._id}`}>
                        <button class="h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800">{<i class="fas fa-edit"></i>}</button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </>
            ) : ( <>
            {data.UsuariosNoPendiente.map((u) => {
                  return (
                    <tr key={u._id}>
                      <td>{u.nombre}</td>
                      <td>{u.apellido}</td>
                      <td>{u.correo}</td>
                      <td>{u.identificacion}</td>
                      <td>{Enum_Rol[u.rol]}</td>
                      <td>{Enum_EstadoUsuario[u.estado]}</td>
                      <td>
                        <Link to={`/usuarios/editar/${u._id}`}>
                        <button class="h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800">{<i class="fas fa-edit"></i>}</button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            
            </>)}
          </tbody>
        </table>
      </div>
    </PrivateRoute>
  );
};



export default IndexUsuarios;


