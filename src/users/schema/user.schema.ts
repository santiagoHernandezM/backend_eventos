import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Centro } from 'src/centro/schema/centro.schema';
import { ContratoDto } from '../dto/contrato.dto';
import { Programa } from 'src/programa/schema/programa.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  documento: string;

  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true })
  correo: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true })
  celular: string;

  @Prop({ required: false, default: 'No especificado' })
  contrato?: ContratoDto;

  @Prop({
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Programa', default: null },
    ],
  })
  programas: any[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Centro' })
  centro: Centro;

  @Prop({ default: ['userBasic'] })
  roles: string[];
}
export const UserSchema = SchemaFactory.createForClass(User);
