import { Document } from 'mongoose';

export interface IAmbiente extends Document {
  readonly codigo: string;
  readonly bloque: string;
  readonly tipo: string;
  readonly sede: string;
}
