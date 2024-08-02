import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/schema/user.schema';
import { JwtPayload } from '../interfaces/jwt-strategy.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(JwtService) private jwtService: JwtService,
    private readonly configService: ConfigService,

  ) {
    super({
      secretOrKey: configService.get<string>('SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(
    payload: JwtPayload,
  ): Promise<User | { access_token: string }> {

    const { correo } = payload;

    const userBd = await this.userModel.findOne({ correo: correo });
    
    if (!userBd) {
      throw new UnauthorizedException('El usuario no esta registrado');
    }

    const payloadZ = {
      sub: userBd.id,
      correo: userBd.correo,
      rol: userBd.roles,
    };
    let userNew: any = userBd;
    userNew.access_token = await this.jwtService.signAsync(payloadZ);
    return userNew;
  }

  async loginJwt(payload: JwtPayload): Promise<any> {
    const { correo, password } = payload;

    let userBd: any = await this.userModel
      .findOne({ correo: correo })
      .select([
        'correo',
        'password',
        'documento',
        'nombre',
        'apellido',
        'contrato',
        'programas',
        'centro',
        'roles',
        'activo'
      ])
      .populate('programas');
    if (!userBd) {
      throw new UnauthorizedException('El usuario no esta registrado');
    } else if (!bcrypt.compareSync(password, userBd.password)) {
      throw new UnauthorizedException('La contraseña es incorrecta');
    }
    else if (!userBd.activo) {
      throw new UnauthorizedException('Usuario inactivo')
    }
    console.log(userBd)
    const payloadZ = {
      sub: userBd.id,
      correo: userBd.correo,
      rol: userBd.roles,
    };
    userBd.password = null;
    const userReturn = {
      id: userBd._id,
      documento: userBd.documento,
      nombre: userBd.nombre,
      apellido: userBd.apellido,
      correo: userBd.correo,
      contrato: userBd.contrato,
      programas: userBd.programas,
      centro: userBd.centro,
      roles: userBd.roles,
      access_token: await this.jwtService.signAsync(payloadZ),
    };
    return userReturn;
  }
}
