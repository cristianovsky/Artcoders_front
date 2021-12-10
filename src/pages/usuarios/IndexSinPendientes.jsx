import React, { useEffect } from 'react';
import { useUser } from 'context/userContext';
import { useQuery } from '@apollo/client';
import { GET_USUARIOS } from 'graphql/usuarios/queries';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Enum_Rol, Enum_EstadoUsuario } from 'utils/enums';
import PrivateRoute from 'components/PrivateRoute';
import { GET_USUARIOSNOPENDIENTE } from 'graphql/usuarios/queries';
import { GET_USUARIO } from 'graphql/usuarios/queries';


const IndexSinPendientes = () =>{
    console.log('entre aqui')
    const { data, error, loading } = useQuery(GET_USUARIOSNOPENDIENTE); 
  const {userData} = useUser();
  
    useEffect(() => {
      if (error) {
        toast.error('Error consultando los usuarios');
      }
    }, [error]);
  
    if (loading) return <div>Cargando....</div>;
  
    return (
      <PrivateRoute roleList={userData.rol}>
        <div>
          Datos Usuarios:
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
              {userData.rol==='LIDER' ? (
                <>
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
                            <i className='fas fa-pen text-yellow-600 hover:text-yellow-400 cursor-pointer' />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </>
              ) : ( <></>)}
            </tbody>
          </table>
        </div>
      </PrivateRoute>
    );
  };

  export default IndexUsuarios;