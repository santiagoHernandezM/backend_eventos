import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Sede } from 'src/sedes/schema/sede.schema';

export type BloqueDocument = HydratedDocument<Bloque>;

@Schema()
export class Bloque {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  nomenclatura: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Sede' })
  sede: Sede;
}

export const BloqueSchema = SchemaFactory.createForClass(Bloque);
