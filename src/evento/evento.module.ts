import { Module } from '@nestjs/common';
import { EventoService } from './evento.service';
import { EventoController } from './evento.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Evento, EventoSchema } from './schema/evento.schema';
import { GestorTModule } from 'src/gestor-t/gestor-t.module';
import { GestorAmbienteModule } from 'src/gestor-ambiente/gestor-ambiente.module';
import * as moment from 'moment';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Evento.name, schema: EventoSchema }]),
    GestorTModule,
    GestorAmbienteModule,
  ],

  providers: [
    EventoService,
    {
      provide: 'MomentWrapper',
      useValue: moment,
    },
  ],
  controllers: [EventoController],
})
export class EventoModule {}
