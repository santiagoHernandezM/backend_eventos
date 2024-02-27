import { Module } from '@nestjs/common';
import { GestorTService } from './gestor-t.service';
import { GestorTController } from './gestor-t.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Gestor, GestorSchema } from './schema/gestor-t.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gestor.name, schema: GestorSchema }]),
  ],
  controllers: [GestorTController],
  providers: [GestorTService],
  exports: [GestorTService],
})
export class GestorTModule {}
