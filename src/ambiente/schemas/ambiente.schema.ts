import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
// import { Schema } from 'mongoose';
import { Sede } from '../../sedes/schema/sede.schema';
import { Bloque } from '../../bloque/schema/bloque.schema';
import { TipoAmbiente } from 'src/tipo-ambiente/schemas/tipo-ambiente.schema';

export type AmbienteDocument = HydratedDocument<Ambiente>;

@Schema()
export class Ambiente {
  @Prop({
    required: true,
    unique: true,
  })
  codigo: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bloque',
  })
  bloque: Bloque;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TipoAmbiente',
  })
  tipo: TipoAmbiente;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sede',
  })
  sede: Sede;
}

export const AmbienteSchema = SchemaFactory.createForClass(Ambiente);
