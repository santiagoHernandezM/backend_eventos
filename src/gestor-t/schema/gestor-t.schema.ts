import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Ficha } from 'src/ficha/schema/ficha.schema';
import { competenciaDto } from '../dto/competencia.dto';
export type GestorTDocument = HydratedDocument<Gestor>;
@Schema()
export class Gestor {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Ficha', required: true })
  ficha: Ficha;

  @Prop({ required: true, default: 0 })
  duracion: number;

  @Prop({ default: 0 })
  acumulado: number;

  @Prop({ required: true })
  competencias: competenciaDto[];
}
export const GestorSchema = SchemaFactory.createForClass(Gestor);
