import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MesGestorHorasFicha } from '../dto/mes-gestor-horas-ficha.dto';
export type GestorHorasFichaDocument = HydratedDocument<GestorHorasFicha>;
@Schema()
export class GestorHorasFicha {
  @Prop()
  codigo_ficha: string;

  @Prop()
  year: number;

  @Prop({ default: [] })
  meses: MesGestorHorasFicha[];
}
export const GestorHorasFichaSchema =
  SchemaFactory.createForClass(GestorHorasFicha);
