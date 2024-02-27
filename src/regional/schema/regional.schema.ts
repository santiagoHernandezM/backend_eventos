import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RegionalDocument = HydratedDocument<Regional>;

@Schema()
export class Regional {
  @Prop({ required: true })
  codigo: string;

  @Prop({ required: true })
  nombre: string;

  @Prop()
  municipio: string;

  @Prop()
  departamento: string;
}
export const RegionalSchema = SchemaFactory.createForClass(Regional);
