import { Module } from '@nestjs/common';
import { EventoService } from './evento.service';
import { EventoController } from './evento.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Evento, EventoSchema } from './schema/evento.schema';
import { GestorTModule } from 'src/gestor-t/gestor-t.module';
import { GestorAmbienteModule } from 'src/gestor-ambiente/gestor-ambiente.module';
import * as moment from 'moment';
import { GestorHorasFichaModule } from 'src/gestor-horas-ficha/gestor-horas-ficha.module';
import { GestorHorasFichaService } from 'src/gestor-horas-ficha/gestor-horas-ficha.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Evento.name, schema: EventoSchema }]),
    GestorTModule,
    GestorAmbienteModule,
    GestorHorasFichaModule,
  ],

  providers: [
    EventoService,
    {
      provide: 'MomentWrapper',
      useValue: moment,
    },
    GestorHorasFichaService,
  ],
  controllers: [EventoController],
})
export class EventoModule {}
