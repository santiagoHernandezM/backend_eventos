import { Module } from '@nestjs/common';
import { SedesController } from './sedes.controller';
import { SedesService } from './sedes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Sede, SedeSchema } from './schema/sede.schema';
import { CentroModule } from 'src/centro/centro.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sede.name, schema: SedeSchema }]),
    CentroModule,
  ],
  controllers: [SedesController],
  providers: [SedesService],
  exports: [SedesService],
})
export class SedesModule {}
