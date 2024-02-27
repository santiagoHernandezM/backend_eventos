import { Module } from '@nestjs/common';
import { GestorAmbienteService } from './gestor-ambiente.service';
import { GestorAmbienteController } from './gestor-ambiente.controller';
import { AmbienteModule } from 'src/ambiente/ambiente.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GestorAmbiente,
  GestorAmbienteSchema,
} from './schema/gestor-ambiente.schema';
import { SedesModule } from 'src/sedes/sedes.module';
import { SedesService } from 'src/sedes/sedes.service';
import { Sede, SedeSchema } from 'src/sedes/schema/sede.schema';

@Module({
  imports: [
    AmbienteModule,
    SedesModule,
    MongooseModule.forFeature([
      { name: GestorAmbiente.name, schema: GestorAmbienteSchema },
      { name: Sede.name, schema: SedeSchema },
    ]),
  ],
  controllers: [GestorAmbienteController],
  providers: [GestorAmbienteService],
  exports: [GestorAmbienteService],
})
export class GestorAmbienteModule {}
