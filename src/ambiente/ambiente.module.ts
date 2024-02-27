import { Module } from '@nestjs/common';
import { AmbienteController } from './ambiente.controller';
import { AmbienteService } from './ambiente.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Ambiente, AmbienteSchema } from './schemas/ambiente.schema';
import { SedesModule } from 'src/sedes/sedes.module';
import { BloqueModule } from 'src/bloque/bloque.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ambiente.name, schema: AmbienteSchema },
    ]),
    SedesModule,
    BloqueModule,
  ],
  controllers: [AmbienteController],
  providers: [AmbienteService],
  exports: [AmbienteService],
})
export class AmbienteModule {}
