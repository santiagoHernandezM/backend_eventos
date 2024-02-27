import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CreateGestorAmbienteDto } from '../dto/gestor-ambiente.dto';
import { Sede } from 'src/sedes/schema/sede.schema';
import { Centro } from 'src/centro/schema/centro.schema';

export type GestorAmbienteDocument = HydratedDocument<GestorAmbiente>;

@Schema()
export class GestorAmbiente {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Sede' })
  sede: Sede;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Centro' })
  centro: Centro;

  @Prop()
  ambientes: CreateGestorAmbienteDto;
}

export const GestorAmbienteSchema =
  SchemaFactory.createForClass(GestorAmbiente);
