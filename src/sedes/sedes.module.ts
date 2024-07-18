import { Module } from '@nestjs/common';
import { SedesController } from './sedes.controller';
import { SedesService } from './sedes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Sede, SedeSchema } from './schema/sede.schema';
import { CentroModule } from 'src/centro/centro.module';
import { Bloque, BloqueSchema } from 'src/bloque/schema/bloque.schema';
import { Ambiente, AmbienteSchema } from 'src/ambiente/schemas/ambiente.schema';
import {
  GestorAmbiente,
  GestorAmbienteSchema,
} from 'src/gestor-ambiente/schema/gestor-ambiente.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sede.name, schema: SedeSchema },
      { name: Bloque.name, schema: BloqueSchema },
      { name: Ambiente.name, schema: AmbienteSchema },
      { name: GestorAmbiente.name, schema: GestorAmbienteSchema },
    ]),
    CentroModule,
  ],
  controllers: [SedesController],
  providers: [SedesService],
  exports: [SedesService],
})
export class SedesModule {}
