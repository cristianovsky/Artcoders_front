import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, ApolloError } from '@apollo/client';
import { PROYECTOS_LIDER,PROYECTOS } from 'graphql/proyectos/queries';
import DropDown from 'components/Dropdown';
import { Dialog } from '@mui/material';
import { Enum_EstadoProyecto,Enum_FaseProyecto } from 'utils/enums';
import ButtonLoading from 'components/ButtonLoading';
import { EDITAR_PROYECTO,} from 'graphql/proyectos/mutations';
import useFormData from 'hooks/useFormData';
import PrivateComponent from 'components/PrivateComponent';
import { Link } from 'react-router-dom';
import { CREAR_INSCRIPCION } from 'graphql/inscripciones/mutaciones';
import { useUser } from 'context/userContext';
import { toast } from 'react-toastify';
import {
  AccordionStyled,
  AccordionSummaryStyled,
  AccordionDetailsStyled,
} from 'components/Accordion';
import { CREAR_AVANCE } from 'graphql/proyectos/mutations';


const IndexCategory1 = () => {
  const { data: queryData, loading, error } = useQuery(PROYECTOS);

  useEffect(() => {
    console.log('datos proyecto', queryData);
  }, [queryData]);

  if (loading) return <div>Cargando...</div>;

  if (queryData.Proyectos) {
    return (
      <div className='p-10 flex flex-col'>
        <div className='flex w-full items-center justify-center'>
          <h1 className='text-2xl font-bold text-gray-900'>Lista de Proyectos</h1>
        </div>  
        {queryData.Proyectos.map((proyecto) => {
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
              {proyecto.nombre} - {proyecto.estado} - {proyecto.fase}
            </div>
          </div>
        </AccordionSummaryStyled>
        <AccordionDetailsStyled>
          <PrivateComponent roleList={['ESTUDIANTE']}>
            <i
              className='mx-4 fas fa-pen text-yellow-600 hover:text-yellow-400'
              onClick={() => {
                setShowDialog(true);
              }}
              />
            </PrivateComponent>
          <PrivateComponent roleList={['ESTUDIANTE']}>
            <AvancesProyectos
              idProyecto={proyecto._id}
              estado={proyecto.estado}
              avances = {proyecto.avances}
            />

          </PrivateComponent>
          <div>Liderado Por: {proyecto.lider.correo}</div>
          <div className='flex'>
            {proyecto.avance.map((avances) => {
              return <Objetivo descripcion={avances.descripcion} observaciones={avances.observaciones} />;
            })}
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

const FormEditProyecto = ({ _id }) => {
  const { form, formData, updateFormData } = useFormData();
  
  const [editarProyecto, { data: dataMutation, loading, error }] = useMutation(EDITAR_PROYECTO);

  const submitForm = (e) => {
    e.preventDefault();
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

  return (
    <div className='p-4'>
    <h1 className='font-bold'>Modificar  del Proyecto</h1>
      <form
        ref={form}
        onChange={updateFormData}
        onSubmit={submitForm}
        className='flex flex-col items-center'
      >
        <DropDown label='Estado del Proyecto' name='estado' options={Enum_EstadoProyecto} /> 
        <DropDown label='Fase del Proyecto' name='fase' options={Enum_FaseProyecto} /> 
        <ButtonLoading disabled={false} loading={loading} text='Confirmar' /> 
      </form>
    </div>
  
  );
};

const Objetivo = ({ tipo, descripcion }) => {
  return (
    <div className='mx-5 my-4 bg-gray-50 p-8 rounded-lg flex flex-col items-center justify-center shadow-xl'>
      <div>{tipo}</div>
      <div>{descripcion}</div>
      <PrivateComponent roleList={['ADMINISTRADOR']}>
        <div>Editar</div>
      </PrivateComponent>
    </div>
  );
};

const AvancesProyectos = ({ idProyecto, estado, avances }) => {
  const [estadoAvance, setEstadoAvance] = useState('');
  const [crearAvance, { data, loading, error }] = useMutation(CREAR_AVANCE);
  const { userData } = useUser();

  useEffect(() => {
    if (userData && avances) {
      const flt = avances.filter((el) => el.estudiante._id === userData._id);
      if (flt.length > 0) {
        setEstadoAvance(flt[0].estado);
      }
    }
  }, [userData, avances]);

  useEffect(() => {
    if (data) {
      console.log(data);
      toast.success('Avance creado con exito');
    }
  }, [data]);

  const confirmarAvance = () => {
    crearAvance({ variables: { proyecto: idProyecto, estudiante: userData._id } });
  };

  return (
    <>
      {estadoAvance !== '' ? (
        <span>Ya fue creado tu avance y el estado es {estadoAvance}</span>
      ) : (
        <ButtonLoading
          onClick={() => confirmarAvance()}
          disabled={estado === 'INACTIVO'}
          loading={loading}
          text='Crear Avance'
        />
      )}
    </>
  );
};

export default IndexCategory1
