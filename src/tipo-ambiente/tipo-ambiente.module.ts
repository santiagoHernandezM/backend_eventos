import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TipoAmbiente,
  TipoAmbienteSchema,
} from './schemas/tipo-ambiente.schema';
import { TipoAmbienteController } from './tipo-ambiente.controller';
import { TipoAmbienteService } from './tipo-ambiente.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TipoAmbiente.name, schema: TipoAmbienteSchema },
    ]),
  ],
  controllers: [TipoAmbienteController],
  providers: [TipoAmbienteService],
})
export class TipoAmbienteModule {}
