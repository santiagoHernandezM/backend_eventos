import { Module } from '@nestjs/common';
import { BloqueController } from './bloque.controller';
import { BloqueService } from './bloque.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Bloque, BloqueSchema } from './schema/bloque.schema';
import { SedesModule } from 'src/sedes/sedes.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bloque.name, schema: BloqueSchema }]),
    SedesModule,
  ],
  controllers: [BloqueController],
  providers: [BloqueService],
})
export class BloqueModule {}
