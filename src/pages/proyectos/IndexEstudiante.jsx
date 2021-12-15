import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, ApolloError } from '@apollo/client';
import { toast } from 'react-toastify';
import { GET_USUARIOS } from 'graphql/usuarios/queries';
import { CREAR_AVANCE } from 'graphql/proyectos/mutations';
import { Link } from 'react-router-dom';
import { Enum_Rol, Enum_EstadoUsuario } from 'utils/enums';
import PrivateRoute from 'components/PrivateRoute';
import PrivateComponent  from 'components/PrivateComponent';
import { PROYECTOS_ESTUDIANTE } from 'graphql/proyectos/queries';
import DropDown from 'components/Dropdown';
import { Dialog } from '@mui/material';
import ButtonLoading from 'components/ButtonLoading';
import useFormData from 'hooks/useFormData';
import Input from 'components/Input';
import { useUser } from 'context/userContext';

import {
    AccordionStyled,
    AccordionSummaryStyled,
    AccordionDetailsStyled,
  } from 'components/Accordion';
import { DataStore } from 'apollo-client/data/store';


  const IndexProyectosEstudiante = () => {
    const {userData} = useUser();
    const { data, loading, error } = useQuery(PROYECTOS_ESTUDIANTE,{
      variables: { estudiante:userData._id }
    });

    console.log('id espia',userData._id)

    useEffect(() => {
      console.log('datos proyecto3', data);
    }, [data]);
  
    if (loading) return <div>Cargando...</div>;
  
    if (data.ProyectosPorEstudiante) {
      return (
        <div className='p-10 flex flex-col'>
          <div className='flex w-full items-center justify-center'>
            <h1 className="text-center text-3xl font-extrabold text-indigo-700">Lista de Proyectos</h1>
          </div>
          <PrivateComponent roleList={'LIDER'}>
            <div className='my-2 self-end'>
              <button className='bg-indigo-500 text-gray-50 p-2 rounded-lg shadow-lg hover:bg-indigo-400'>
                <Link to='/proyectos/Avances'>Crear Avance</Link>
              </button>
            </div>
          </PrivateComponent>
              {data.ProyectosPorEstudiante.map((proyecto) => {
                return <AccordionProyecto proyecto={proyecto} />;
                })}
        </div>
      );
    }
  
    return <></>;
  };

  const AccordionProyecto = ({ proyecto }) => {
    const [showDialog, setShowDialog] = useState(false);
    return (
      <>
        <AccordionStyled>
          <AccordionSummaryStyled expandIcon={<i className='fas fa-chevron-down' />}>
            <div className='flex w-full justify-between'>
              <div className='uppercase font-bold text-gray-100 '>
                {proyecto.proyecto.nombre} - {proyecto.proyecto.estado} - {proyecto.proyecto.fase}
              </div>
            </div>
          </AccordionSummaryStyled>
          <AccordionDetailsStyled>
            <PrivateComponent roleList={['ADMINISTRADOR','LIDER','ESTUDIANTE']}>
              <i
                className='mx-4 fas fa-pen text-yellow-600 hover:text-yellow-400'
                onClick={() => {
                  setShowDialog(true);
                }}
                />
              </PrivateComponent>
            <div className='flex'>
              {proyecto.proyecto.objetivos.map((objetivo) => {
                return <Objetivo tipo={objetivo.tipo} descripcion={objetivo.descripcion} />;
              })}
            </div>
            {<div className='flex'>
            {proyecto.proyecto.avances === null ? (
            <>
            
            
                 <Avances observaciones="avance.observaciones" descripcion="avance.descripcion"
                  creadoPor="avance.creadoPor.nombr" />;  
               
           </>
            ):(<>

                {proyecto.proyecto.avances.map((avance) => {
                  return <Avances observaciones={avance.observaciones} descripcion={avance.descripcion}
                  /*creadoPor={avance.creadoPor.nombre+" "+avance.creadoPor.apellido}*/ />;
                })}
            
            </>

            )}
              </div>}
          </AccordionDetailsStyled>
        </AccordionStyled>
        <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
        }}
      >
        <FormEditProyecto proyecto_id={proyecto.proyecto._id} />
      </Dialog>
      </>
    );
  };

  const FormEditProyecto = ({ proyecto_id,queryData,creadoPor }) => {
    const { form, formData, updateFormData } = useFormData();
    const {userData} = useUser();
    const [listaUsuarios, setListaUsuarios] = useState({});
    
    const { dataUsuarios, loading:queryLoading, error:queryError } = useQuery(GET_USUARIOS, {
      variables: {
        filtro: { rol: 'ESTUDIANTE', estado: 'AUTORIZADO' },
      },
    });

    console.log("creado por: ",userData._id)
    console.log("proyecto id: ",proyecto_id)

    const [crearAvance, { data: mutationData, loading: mutationLoading, error: mutationError }] =
      useMutation(CREAR_AVANCE,{
        variables: {
        creadoPor:userData._id,
        proyecto:proyecto_id,
    },
    });
  
  
    useEffect(() => {
      console.log('data mutation', mutationData);
    });
  
    const submitForm = (e) => {
      e.preventDefault();
  
      crearAvance({
        variables: formData,
      });
    };
  
    useEffect(() => {
      if (mutationData) {
        toast.success('avance agregado correctamente');
      }
    }, [mutationData]);
  
    useEffect(() => {
      if (mutationError) {
        toast.error('Error agregandoo avance');
      }
  
      if (queryError) {
        toast.error('Error consultando el Usuario');
      }
    }, [queryError, mutationError]);

    if (queryLoading) return <div>Cargando....</div>;
  
    return (
      <div className='p-10 flex flex-col items-center'>
        <div className='self-start'>
          <Link to='/proyectos'>
            <i className='fas fa-arrow-left' />
          </Link>
        </div>
        <h1 className='text-2xl font-bold text-gray-900'>Crear Nuevo Avance</h1>
        <form ref={form} onChange={updateFormData} onSubmit={submitForm}>
          <Input name='descripcion' label='Descripcion del avance' required={true} type='text' />
          <Input name='fecha' label='Fecha de Inicio' required={true} type='date' />
          <ButtonLoading text='Crear Avance' loading={false} disabled={false} />
        </form>
      </div>
    );
  };

  const Objetivo = ({ tipo, descripcion }) => {
    return (
      <div className='mx-5 my-4 bg-gray-50 p-8 rounded-lg flex flex-col items-center justify-center shadow-xl'>
        <div className='text-lg font-bold'>{tipo}</div>
        <div>{descripcion}</div>
        <PrivateComponent roleList={['ADMINISTRADOR','LIDER']}>
          <div>Editar</div>
        </PrivateComponent>
      </div>
    );
  };

  const Avances = ({  descripcion,observaciones, creadoPor }) => {
    return (
      <div className='mx-5 my-4 bg-gray-50 p-8 rounded-lg flex flex-col items-center justify-center shadow-xl'>
        <div className='text-lg font-bold'>{creadoPor}</div>
        <div>{descripcion}</div>
        <div>{observaciones}</div>
        <PrivateComponent roleList={['ADMINISTRADOR']}>
          <div>Editar</div>
        </PrivateComponent>
      </div>
    );
  };
export default IndexProyectosEstudiante