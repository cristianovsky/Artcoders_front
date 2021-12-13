import React, { useEffect } from 'react';
import { useUser } from 'context/userContext';
import { useQuery } from '@apollo/client';
import {PROYECTOSPORLIDER} from 'graphql/proyectos/queries';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Enum_Rol, Enum_EstadoUsuario } from 'utils/enums';
import PrivateRoute from 'components/PrivateRoute';

const ProyectosLider = () => {
  const { userData } = useUser();
  const { data, error, loading } = useQuery(PROYECTOSPORLIDER,{
    variables: {lider: userData._id}
  });

  useEffect(() => {
    if (error) {
      toast.error("Error consultando los usuarios");
    }
  }, [error]);

  if (loading) return <div>Cargando....</div>;

  return (
    <PrivateRoute roleList={userData.rol}>
      <div>
        <h1 class="text-center text-3xl font-extrabold text-indigo-700">
          PROYECTOS QUE LIDERAS
        </h1>
        <table className="tabla">
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
            <>
              {data.ProyectosPorLider.map((u) => {
                return (
                  <tr key={u._id}>
                    <td>{u.nombre}</td>
                    <td>{u.apellido}</td>
                    <td>{u.correo}</td>
                    <td>{u.identificacion}</td>
                    <td>{Enum_Rol[u.rol]}</td>
                    <td>{Enum_EstadoUsuario[u.estado]}</td>
                    <td>
                      <Link to={`usuarios/misproyectos`}>
                        <button class="h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800">
                          {<i class="fas fa-edit"></i>}
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </>
          </tbody>
        </table>
      </div>
    </PrivateRoute>
  );
};



export default ProyectosLider;


