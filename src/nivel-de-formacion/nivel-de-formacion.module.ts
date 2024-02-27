import { Module } from '@nestjs/common';
import { NivelDeFormacionController } from './nivel-de-formacion.controller';
import { NivelDeFormacionService } from './nivel-de-formacion.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NivelDeFormacion,
  NivelDeFormaciónSchema,
} from './schema/nivel-de-formacion.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NivelDeFormacion.name, schema: NivelDeFormaciónSchema },
    ]),
  ],
  controllers: [NivelDeFormacionController],
  providers: [NivelDeFormacionService],
})
export class NivelDeFormacionModule {}
