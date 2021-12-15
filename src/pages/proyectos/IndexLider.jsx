import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, ApolloError } from '@apollo/client';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Enum_Rol, Enum_EstadoUsuario } from 'utils/enums';
import PrivateRoute from 'components/PrivateRoute';
import PrivateComponent  from 'components/PrivateComponent';
import { PROYECTOS_LIDER } from 'graphql/proyectos/queries';
import DropDown from 'components/Dropdown';
import { Dialog } from '@mui/material';
import { Enum_EstadoProyecto,Enum_FaseProyecto } from 'utils/enums';
import ButtonLoading from 'components/ButtonLoading';
import { EDITAR_PROYECTO } from 'graphql/proyectos/mutations';
import useFormData from 'hooks/useFormData';
import Input from 'components/Input';

import {
    AccordionStyled,
    AccordionSummaryStyled,
    AccordionDetailsStyled,
  } from 'components/Accordion';

  const IndexProyectosLider = () => {
    const { data: queryData, loading:queryLoading, error:queryError } = useQuery(PROYECTOS_LIDER,{
      variables: { lider:localStorage.getItem('_id') },
    });

    useEffect(() => {
      console.log('datos proyecto', queryData);
    }, [queryData]);
  
    if (queryLoading) return <div>Cargando...</div>;
  
    if (queryData.ProyectosPorLider) {
      return (
        <div className='p-10 flex flex-col'>
          <div className='flex w-full items-center justify-center'>
            <h1 className="text-center text-3xl font-extrabold text-indigo-700">Lista de Proyectos</h1>
          </div>
          <PrivateComponent roleList={['ADMINISTRADOR', 'LIDER']}>
            <div className='my-2 self-end'>
              <button className='bg-pink-400 text-gray-50 p-2 rounded-lg shadow-lg hover:bg-pink-200'>
                <Link to='/proyectos/nuevo'>Crear nuevo proyecto</Link>
              </button>
            </div>
          </PrivateComponent>
              {queryData.ProyectosPorLider.map((proyecto) => {
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
                {proyecto.nombre} - {proyecto.estado} - {proyecto.fase} - {proyecto.avance}
              </div>
            </div>
          </AccordionSummaryStyled>
          <AccordionDetailsStyled>
            <PrivateComponent roleList={['ADMINISTRADOR','LIDER']}>
              <i
                className='mx-4 fas fa-pen text-yellow-600 hover:text-yellow-400'
                onClick={() => {
                  setShowDialog(true);
                }}
                />
              </PrivateComponent>
            <div className='flex'>
              {proyecto.objetivos.map((objetivo) => {
                return <Objetivo tipo={objetivo.tipo} descripcion={objetivo.descripcion} />;
              })}
            </div>
            <div className='flex'>
            {proyecto.avances === null ? ( 
            <>
              <Avances observaciones="avance.observaciones" descripcion= "avance.descripcion"
              creadoPor="avance.creadoPor.nombre" />;  
            </>
            ):(<>

                {proyecto.avances.map((avance) => {
                  return <Avances observaciones={avance.observaciones} descripcion={avance.descripcion}
                  /*creadoPor={avance.creadoPor.nombre+" "+avance.creadoPor.apellido}*/ />;
                })}
            
            </>

            )}
            </div>
          </AccordionDetailsStyled>
        </AccordionStyled>
        <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
        }}
      >
        <FormEditProyecto _id={proyecto._id} />
      </Dialog>
      </>
    );
  };

  const FormEditProyecto = ({ _id,queryData,queryError,queryLoading }) => {
    const { form, formData, updateFormData } = useFormData();
    
    const [editarProyecto, { data: dataMutation, loading, error:mutationError }] = useMutation(EDITAR_PROYECTO);
  
    const submitForm = (e) => {
      e.preventDefault();
      formData.presupuesto = parseFloat(formData.presupuesto);
      editarProyecto({
        variables: {
          _id,
          campos:formData,
        },
      });
      console.log(formData)
    };
  
  
    useEffect(() => {
      console.log('data mutation', dataMutation);
    }, [dataMutation]);
  
    useEffect(() => {
      if (dataMutation) {
        toast.success('Proyecto modificado correctamente');
      }
    }, [dataMutation]);
  
    useEffect(() => {
      if (mutationError) {
        toast.error('Error modificando el proyecto');
      }
  
      if (queryError) {
        toast.error('Error consultando el proyecto');
      }
    }, [queryError, mutationError]);

    if (queryLoading) return <div>Cargando....</div>;
    return (
      <div className='p-4'>
      <h1 className='font-bold'>Modificar informacion del Proyecto</h1>
        <form
          ref={form}
          onChange={updateFormData}
          onSubmit={submitForm}
          className='flex flex-col items-center'
        >
           <Input
          label='Nombre del proyecto:'
          type='text'
          name='nombre'
          //defaultValue={queryData.ProyectosPorLider.nombre}
          required={true}
        /> 
          <Input
          label='Presupuesto del proyecto:'
          type='number'
          name='presupuesto'
          //defaultValue={queryData.ProyectosPorLider.nombre}
          required={true}
        />
          <ButtonLoading disabled={false} loading={loading} text='Confirmar' /> 
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
        <div className='text-lg font-bold'>AVANCES</div>
        <div>{creadoPor}</div>
        <div>{descripcion}</div>
        <div>{observaciones}</div>
        <PrivateComponent roleList={['ADMINISTRADOR']}>
          <div>Editar</div>
        </PrivateComponent>
      </div>
    );
  };
export default IndexProyectosLider