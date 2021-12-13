import { gql } from '@apollo/client';

const PROYECTOS = gql`
  query Proyectos {
    Proyectos {
      _id
      nombre
      estado
      fase
      objetivos {
        descripcion
        tipo
      }
      lider {
        _id
        correo
      }
      inscripciones {
        estado
        estudiante {
          _id
        }
      }
    }
  }
`;

const PROYECTOS_LIDER = gql`
query Query ($lider:String!){
  ProyectosPorLider(lider:$lider) {
    _id
    nombre
    presupuesto
    estado 
    fase
    objetivos {
      descripcion
      tipo
      _id
    }
    avances {
      _id
      fecha
      descripcion
      observaciones
      creadoPor {
        nombre
        apellido
      }
    }
  }
}
`;

const PROYECTOS_ESTUDIANTE = gql`
query ProyectosPorEstudiante($estudiante: String!) {
  ProyectosPorEstudiante(estudiante: $estudiante) {
  proyecto {
    nombre
    fase
    fechaInicio
    fechaFin
    presupuesto
    objetivos {
      descripcion
    }
    lider {
      nombre
      apellido
    }
  } 
  }
}
`;



export { PROYECTOS, PROYECTOS_LIDER, PROYECTOS_ESTUDIANTE };
