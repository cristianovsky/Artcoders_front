import { gql } from '@apollo/client';

const EDITAR_PROYECTO = gql`
  mutation Mutation($_id: String!, $campos: camposProyecto!) {
    editarProyecto(_id: $_id, campos: $campos) {
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
mutation Mutation($descripcion: String!, $fecha: Date, $proyecto: String!, $creadoPor: String!) {
  crearAvance(descripcion: $descripcion, fecha: $fecha, proyecto: $proyecto, creadoPor: $creadoPor) {
    fecha
    descripcion
  }
}

`;

const EDITAR_OBJETIVO =gql`
mutation Mutation($idProyecto: String!, $indexObjetivo: Int!, $campos: camposObjetivo!) {
  editarObjetivo(idProyecto: $idProyecto, campos: $campos, indexObjetivo: $indexObjetivo) {
    objetivos {
      _id
      descripcion
      tipo
    }
  }
}
`

export { EDITAR_PROYECTO, CREAR_PROYECTO,CREAR_AVANCE,EDITAR_OBJETIVO };
