import { Module } from '@nestjs/common';
import { ProgramaController } from './programa.controller';
import { ProgramaService } from './programa.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Programa, ProgramaSchema } from './schema/programa.schema';
import { InstructoresPrograma, InstructoresProgramaSchema } from './schema/instructoresprograma.schema';
import { CompetenciaModule } from 'src/competencia/competencia.module';

@Module({
  imports: [
    CompetenciaModule,
    MongooseModule.forFeature([
      { name: Programa.name, schema: ProgramaSchema },
      { name: InstructoresPrograma.name, schema: InstructoresProgramaSchema },
    ]),
  ],
  controllers: [ProgramaController],
  providers: [ProgramaService],
  exports: [ProgramaService],
})
export class ProgramaModule {}
