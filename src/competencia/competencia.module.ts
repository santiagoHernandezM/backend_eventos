import { Module } from '@nestjs/common';
import { CompetenciaService } from './competencia.service';
import { CompetenciaController } from './competencia.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Competencia, CompetenciaSchema } from './schema/competencia.schema';
import { ProgramaModule } from 'src/programa/programa.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Competencia.name, schema: CompetenciaSchema },
    ]),
    ProgramaModule,
  ],

  providers: [CompetenciaService],
  controllers: [CompetenciaController],
  exports: [CompetenciaService],
})
export class CompetenciaModule {}
