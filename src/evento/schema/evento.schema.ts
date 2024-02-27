import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { eventosDto } from '../dto/eventos.dto';
import { User } from 'src/users/schema/user.schema';

export type EventoDocument = HydratedDocument<Evento>;

@Schema()
export class Evento {
  @Prop({ required: true })
  mes: number;

  @Prop({ required: true })
  year: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  instructor: User;

  @Prop({ required: true })
  eventos: eventosDto[];
}
export const EventoSchema = SchemaFactory.createForClass(Evento);
