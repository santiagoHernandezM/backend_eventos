import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SedesModule } from './sedes/sedes.module';
import { RegionalModule } from './regional/regional.module';
import { CentroModule } from './centro/centro.module';
import { AmbienteModule } from './ambiente/ambiente.module';
import { BloqueModule } from './bloque/bloque.module';
import { TipoAmbienteModule } from './tipo-ambiente/tipo-ambiente.module';
import { ProgramaModule } from './programa/programa.module';
import { NivelDeFormacionModule } from './nivel-de-formacion/nivel-de-formacion.module';
import { JornadaModule } from './jornada/jornada.module';
import { TipoDeVinculacionModule } from './tipo-de-vinculacion/tipo-de-vinculacion.module';
import { FichaModule } from './ficha/ficha.module';
import { ModalidadModule } from './modalidad/modalidad.module';
import { CompetenciaModule } from './competencia/competencia.module';
import { EventoModule } from './evento/evento.module';
import { GestorTModule } from './gestor-t/gestor-t.module';
import { GestorAmbienteModule } from './gestor-ambiente/gestor-ambiente.module';
import { CargueMasivoCompetenciasModule } from './cargue-masivo-competencias/cargue-masivo-competencias.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './email/email.module';
import { GestorHorasFichaModule } from './gestor-horas-ficha/gestor-horas-ficha.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB'),
      }),
      inject: [ConfigService],
    }),

    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        // port: 465,
        // secure: true, // true para usar SSL/TLS
        auth: {
          user: 'senaeventos2024@gmail.com', // tu dirección de correo electrónico de Gmail
          pass: 'rfosvfegxxaweodr', // tu contraseña de Gmail o una contraseña de aplicación generada
        },
      },
    }),

    CentroModule,
    SedesModule,
    RegionalModule,
    AmbienteModule,
    BloqueModule,
    TipoAmbienteModule,
    ProgramaModule,
    NivelDeFormacionModule,
    JornadaModule,
    TipoDeVinculacionModule,
    FichaModule,
    ModalidadModule,
    CompetenciaModule,
    EventoModule,
    GestorTModule,
    GestorAmbienteModule,
    CargueMasivoCompetenciasModule,
    AuthModule,
    UsersModule,
    JwtModule,
    EmailModule,
    GestorHorasFichaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
