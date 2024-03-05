import { Module } from '@nestjs/common';
import { RegionalController } from './regional.controller';
import { RegionalService } from './regional.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Regional, RegionalSchema } from './schema/regional.schema';
import { Centro, CentroSchema } from 'src/centro/schema/centro.schema';
import { Sede, SedeSchema } from 'src/sedes/schema/sede.schema';
import { Bloque, BloqueSchema } from 'src/bloque/schema/bloque.schema';
import { Ambiente, AmbienteSchema } from 'src/ambiente/schemas/ambiente.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Regional.name, schema: RegionalSchema },
      { name: Centro.name, schema: CentroSchema },
      { name: Sede.name, schema: SedeSchema },
      { name: Bloque.name, schema: BloqueSchema },
      { name: Ambiente.name, schema: AmbienteSchema }
    ]),
    
  ],
  controllers: [RegionalController],
  providers: [RegionalService],
  exports: [RegionalService],
})
export class RegionalModule {}
