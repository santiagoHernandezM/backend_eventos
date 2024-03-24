import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Programa } from './programa.schema';
import { User } from 'src/users/schema/user.schema';

export type InstructoresProgramaDocument =
  HydratedDocument<InstructoresPrograma>;

@Schema()
export class InstructoresPrograma {
  @Prop({ required: true })
  programa: string;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Programa' })
  // programa: any;

  @Prop({ required: true })
  instructores: string[];

  // @Prop({
  //   type: [
  //     { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  //   ],
  // })
  // instructores: any[];
}

export const InstructoresProgramaSchema =
  SchemaFactory.createForClass(InstructoresPrograma);
