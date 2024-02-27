import { Document } from 'mongoose';

export interface ITipoAmbiente extends Document {
  readonly codigo: string;
  readonly nombre: string;
  /* readonly descripcion: object; */
}
