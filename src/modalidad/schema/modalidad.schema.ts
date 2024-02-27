import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ModalidadDocument = HydratedDocument<Modalidad>;
@Schema()
export class Modalidad {
  @Prop({ required: true })
  nombre: string;
}
export const ModalidadSchema = SchemaFactory.createForClass(Modalidad);
