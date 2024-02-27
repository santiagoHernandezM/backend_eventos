import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TipoAmbienteDocument = HydratedDocument<TipoAmbiente>;

@Schema()
export class TipoAmbiente {
  @Prop({ unique: true, type: String })
  codigo: string;

  @Prop({ type: String, required: true })
  nombre: string;

  /* @Prop({ type: Object, required: true })
  descripcion: object; */
}

export const TipoAmbienteSchema = SchemaFactory.createForClass(TipoAmbiente);
