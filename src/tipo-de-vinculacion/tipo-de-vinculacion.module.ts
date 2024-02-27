import { Module } from '@nestjs/common';
import { TipoDeVinculacionService } from './tipo-de-vinculacion.service';
import { TipoDeVinculacionController } from './tipo-de-vinculacion.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TipoDeVinculacion,
  TipoDeVinculacionSchema,
} from './schema/tipo-de-vinculacion.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TipoDeVinculacion.name, schema: TipoDeVinculacionSchema },
    ]),
  ],
  providers: [TipoDeVinculacionService],
  controllers: [TipoDeVinculacionController],
  exports: [TipoDeVinculacionService],
})
export class TipoDeVinculacionModule {}
