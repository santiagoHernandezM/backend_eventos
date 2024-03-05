import { Module } from '@nestjs/common';
import { CentroService } from './centro.service';
import { CentroController } from './centro.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Centro, CentroSchema } from './schema/centro.schema';
import { RegionalModule } from '../regional/regional.module';
import { Sede, SedeSchema } from 'src/sedes/schema/sede.schema';
import { Bloque, BloqueSchema } from 'src/bloque/schema/bloque.schema';
import { Ambiente, AmbienteSchema } from 'src/ambiente/schemas/ambiente.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Centro.name, schema: CentroSchema },
      { name: Sede.name, schema: SedeSchema },
      { name: Bloque.name, schema: BloqueSchema },
      { name: Ambiente.name, schema: AmbienteSchema },
    ]),
    RegionalModule
  ],
  controllers: [CentroController],
  providers: [CentroService],
  exports: [CentroService]

})
export class CentroModule {}
