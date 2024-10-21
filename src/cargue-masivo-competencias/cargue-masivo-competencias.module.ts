import { Module } from '@nestjs/common';
import { CargueMasivoCompetenciasController } from './cargue-masivo-competencias.controller';
import { CargueMasivoCompetenciasService } from './cargue-masivo-competencias.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Competencia,
  CompetenciaSchema,
} from 'src/competencia/schema/competencia.schema';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { Programa, ProgramaSchema } from 'src/programa/schema/programa.schema';
import { UsersModule } from '../users/users.module';
import { Ficha, FichaSchema } from 'src/ficha/schema/ficha.schema';
import { CentroModule } from 'src/centro/centro.module';
import { SedesModule } from 'src/sedes/sedes.module';
import { AmbienteModule } from 'src/ambiente/ambiente.module';
import { FichaModule } from 'src/ficha/ficha.module';

@Module({
  imports: [
    UsersModule,
    CentroModule,
    SedesModule,
    AmbienteModule,
    FichaModule,
    MongooseModule.forFeature([
      { name: Competencia.name, schema: CompetenciaSchema },
      { name: User.name, schema: UserSchema },
      { name: Programa.name, schema: ProgramaSchema },
      { name: Ficha.name, schema: FichaSchema },
    ]),
  ],
  controllers: [CargueMasivoCompetenciasController],
  providers: [CargueMasivoCompetenciasService],
  exports: [MongooseModule, CargueMasivoCompetenciasService],
})
export class CargueMasivoCompetenciasModule {}
