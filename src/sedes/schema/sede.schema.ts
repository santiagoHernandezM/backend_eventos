import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Centro } from 'src/centro/schema/centro.schema';

export type SedeDocument = HydratedDocument<Sede>;

@Schema()
export class Sede {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Centro' })
  centro: Centro;

  @Prop()
  lugar_funcionamiento: string;

  @Prop()
  departamento: string;

  @Prop()
  municipio: string;
}

export const SedeSchema = SchemaFactory.createForClass(Sede);
