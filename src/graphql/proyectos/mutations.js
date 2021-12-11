import { gql } from '@apollo/client';

const EDITAR_PROYECTO = gql`
  mutation Mutation($_id: String!, $campos: camposProyecto!) {
    editarProyecto(_id: $_id, campos: $campos) {
      _id
      estado
      fase
    }
  }
`;

const CREAR_PROYECTO = gql`
  mutation CrearProyecto(
    $nombre: String!
    $presupuesto: Float!
    $fechaInicio: Date!
    $fechaFin: Date!
    $lider: String!
    $objetivos: [crearObjetivo]
  ) {
    crearProyecto(
      nombre: $nombre
      presupuesto: $presupuesto
      fechaInicio: $fechaInicio
      fechaFin: $fechaFin
      lider: $lider
      objetivos: $objetivos
    ) {
      _id
    }
  }
`;

const CREAR_AVANCE = gql`
  mutation CrearAvance(
    $descripcion: String!,
    $observaciones:[String]
    $proyecto: String!,
    $creadoPor: String!
  ) {
    crearAvance(
      descripcion: $descripcion, 
      onservaciones:$observaciones,
      proyecto: $proyecto, 
      creadoPor: creadoPor
    ) {
      _id
    }
  }
`;

export { EDITAR_PROYECTO, CREAR_PROYECTO,CREAR_AVANCE };
