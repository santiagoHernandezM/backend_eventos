import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { competenciasDto } from '../dto/competencias.dto';

export type CompetenciaDocument = HydratedDocument<Competencia>;

@Schema()
export class Competencia {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Programa' })
  programa: string;

  @Prop({ required: true })
  competencias: competenciasDto[];
}

export const CompetenciaSchema = SchemaFactory.createForClass(Competencia);
