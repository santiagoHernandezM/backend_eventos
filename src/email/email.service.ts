import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateEmailDto } from './dto/create-email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async enviarCorreo(createEmailDto: CreateEmailDto, token: string) {
    try {
      await this.mailerService.sendMail({
        to: createEmailDto.email,
        from: 'senaeventos2024@gmail.com',
        subject: 'Restablecer contraseña - SENA EVENTOS',
        html: `
        <h1>Olvidó su contraseña?</h1>
        <p>Para restablecer su contraseña presione en continuar</p>
        <a href="http://localhost:8080/#/change-password?token=${token}">CONTINUAR</a>
        `,
      });
      console.log(
        `<a>http://localhost:8080/#/change-password?token=${token}</a>`,
      );
      return {
        message: 'mensaje enviado con éxito',
      };
    } catch (error) {
      console.log(error);
    }
  }
}
