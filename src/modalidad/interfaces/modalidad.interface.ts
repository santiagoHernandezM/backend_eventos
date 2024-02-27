import { Document } from 'mongoose';
export interface Modalidad extends Document {
  readonly nombre: string;
}
