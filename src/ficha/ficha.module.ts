import { Module } from '@nestjs/common';
import { FichaController } from './ficha.controller';
import { FichaService } from './ficha.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Ficha, FichaSchema } from './schema/ficha.schema';
import { CompetenciaModule } from 'src/competencia/competencia.module';
import { ProgramaModule } from 'src/programa/programa.module';
import { GestorTModule } from 'src/gestor-t/gestor-t.module';
import { GestorHorasFichaModule } from 'src/gestor-horas-ficha/gestor-horas-ficha.module';
import { GestorHorasFichaService } from 'src/gestor-horas-ficha/gestor-horas-ficha.service';

@Module({
  imports: [
    CompetenciaModule,
    ProgramaModule,
    GestorTModule,
    GestorHorasFichaModule,
    MongooseModule.forFeature([{ name: Ficha.name, schema: FichaSchema }]),
  ],
  controllers: [FichaController],
  providers: [FichaService, GestorHorasFichaService],
})
export class FichaModule {}
