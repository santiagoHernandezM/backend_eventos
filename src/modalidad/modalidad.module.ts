import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModalidadController } from './modalidad.controller';
import { Modalidad, ModalidadSchema } from './schema/modalidad.schema';
import { ModalidadService } from './modalidad.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Modalidad.name, schema: ModalidadSchema },
    ]),
  ],
  controllers: [ModalidadController],
  providers: [ModalidadService],
})
export class ModalidadModule {}
