import { forwardRef, Module } from '@nestjs/common';
import { AmbienteController } from './ambiente.controller';
import { AmbienteService } from './ambiente.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Ambiente, AmbienteSchema } from './schemas/ambiente.schema';
import { SedesModule } from 'src/sedes/sedes.module';
import { BloqueModule } from 'src/bloque/bloque.module';
import { GestorAmbienteModule } from 'src/gestor-ambiente/gestor-ambiente.module';
import { GestorAmbienteService } from 'src/gestor-ambiente/gestor-ambiente.service';
import {
  GestorAmbiente,
  GestorAmbienteSchema,
} from 'src/gestor-ambiente/schema/gestor-ambiente.schema';

@Module({
  imports: [
    GestorAmbienteModule,
    MongooseModule.forFeature([
      { name: Ambiente.name, schema: AmbienteSchema },
    ]),
    SedesModule,
    BloqueModule,
  ],
  controllers: [AmbienteController],
  providers: [AmbienteService, GestorAmbienteService],
  exports: [AmbienteService],
})
export class AmbienteModule {}
