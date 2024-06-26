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


@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: Competencia.name, schema: CompetenciaSchema },
     // { name: User.name, schema: UserSchema },
      { name: Programa.name, schema: ProgramaSchema },

    ]),
  ],
  controllers: [CargueMasivoCompetenciasController],
  providers: [CargueMasivoCompetenciasService],
  exports: [CargueMasivoCompetenciasService],
})
export class CargueMasivoCompetenciasModule {}
