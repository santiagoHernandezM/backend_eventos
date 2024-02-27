import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TipoDeVinculacionDocument = HydratedDocument<TipoDeVinculacion>;

@Schema()
export class TipoDeVinculacion {
  @Prop({ required: true })
  nombre: string;
}

export const TipoDeVinculacionSchema =
  SchemaFactory.createForClass(TipoDeVinculacion);
