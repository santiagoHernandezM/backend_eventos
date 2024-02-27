import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProgramaDocument = HydratedDocument<Programa>;

@Schema()
export class Programa {
  @Prop({ required: true })
  codigo: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  nivel: string;

  @Prop({ required: true })
  version: string;

  @Prop({ required: true })
  duracion: number;

  @Prop({ required: true })
  intensidad_horaria: number;
}

export const ProgramaSchema = SchemaFactory.createForClass(Programa);
