import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NivelDeFormacionDocument = HydratedDocument<NivelDeFormacion>;

@Schema()
export class NivelDeFormacion {
  @Prop({ required: true })
  nombre: string;
}

export const NivelDeFormaciónSchema =
  SchemaFactory.createForClass(NivelDeFormacion);
