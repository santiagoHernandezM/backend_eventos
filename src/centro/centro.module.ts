import { Module } from '@nestjs/common';
import { CentroService } from './centro.service';
import { CentroController } from './centro.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Centro, CentroSchema } from './schema/centro.schema';
import { RegionalModule } from '../regional/regional.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Centro.name, schema: CentroSchema }]),
    RegionalModule,
  ],
  controllers: [CentroController],
  providers: [CentroService],
})
export class CentroModule {}
