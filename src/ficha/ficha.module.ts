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
import { User, UserSchema } from 'src/users/schema/user.schema';

@Module({
  imports: [
    CompetenciaModule,
    ProgramaModule,
    GestorTModule,
    GestorHorasFichaModule,
    MongooseModule.forFeature([
      { name: Ficha.name, schema: FichaSchema },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [FichaController],
  providers: [FichaService, GestorHorasFichaService],
  exports: [MongooseModule, FichaService],
})
export class FichaModule {}
