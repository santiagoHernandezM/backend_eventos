import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateEmailDto } from './dto/create-email.dto';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService
  ){}

  async enviarCorreo(createEmailDto: CreateEmailDto){
    await this.mailerService.sendMail({
      to: createEmailDto.destinatario,
      from: 'senaeventos2024@gmail.com',
      subject: 'Asunto del correo',
      text: 'Cambio de contraseña',
      html: '<p>Ahora si funciona eche nojodaaa wepajeee</p>'
    })
  }
}
