import { Module } from '@nestjs/common';
import { GestorHorasFichaService } from './gestor-horas-ficha.service';
import { GestorHorasFichaController } from './gestor-horas-ficha.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  GestorHorasFicha,
  GestorHorasFichaSchema,
} from './schema/gestor-horas-ficha.schema';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { Ficha, FichaSchema } from 'src/ficha/schema/ficha.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GestorHorasFicha.name, schema: GestorHorasFichaSchema },
      { name: Ficha.name, schema: FichaSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [GestorHorasFichaController],
  providers: [GestorHorasFichaService],
  exports: [MongooseModule, GestorHorasFichaService],
})
export class GestorHorasFichaModule {}
