import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type JornadaDocument = HydratedDocument<Jornada>;

@Schema()
export class Jornada {
  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true })
  horaInicio: string;

  @Prop({ required: true })
  horaFin: string;

  @Prop({ required: true })
  horas: number;
}

export const JornadaSchema = SchemaFactory.createForClass(Jornada);
