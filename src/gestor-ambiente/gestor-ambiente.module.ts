import { forwardRef, Module } from '@nestjs/common';
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
import { AmbienteService } from 'src/ambiente/ambiente.service';
import { Ambiente, AmbienteSchema } from 'src/ambiente/schemas/ambiente.schema';
import { Bloque, BloqueSchema } from 'src/bloque/schema/bloque.schema';

@Module({
  imports: [
    SedesModule,
    MongooseModule.forFeature([
      { name: GestorAmbiente.name, schema: GestorAmbienteSchema },
      { name: Sede.name, schema: SedeSchema },
      { name: Ambiente.name, schema: AmbienteSchema },
      { name: Bloque.name, schema: BloqueSchema },
    ]),
  ],
  controllers: [GestorAmbienteController],
  providers: [GestorAmbienteService, SedesService],
  exports: [MongooseModule, GestorAmbienteService],
})
export class GestorAmbienteModule {}
