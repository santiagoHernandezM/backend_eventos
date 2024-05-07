import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { ActualizarUserDto, UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { AsignarProgramaDto } from './dto/asignarprograma.dto';
import { ProgramaService } from 'src/programa/programa.service';
import { InstructoresPrograma } from 'src/programa/schema/instructoresprograma.schema';
import { programaDto } from '../evento/dto/programa.dto';
import { CreateEmailDto } from 'src/email/dto/create-email.dto';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { IncomingHttpHeaders } from 'http';
import { NewPasswordDto } from './dto/new-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(InstructoresPrograma.name)
    private instructoresProgramaModel: Model<InstructoresPrograma>,
    private readonly programaService: ProgramaService,
    private readonly emailService: EmailService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  async obtenerTodo(): Promise<NotFoundException | User[]> {
    return await this.userModel.find().then((data) => {
      if (data) {
        return data;
      } else {
        return new NotFoundException(
          'No se encontraron documentos en usuarios',
        );
      }
    });
  }

  async findOne(nombre: string) {
    return this.userModel
      .findOne({ nombre })
      .populate('centro')
      .populate('programas');
  }

  async findOneAuth(email: string) {
    return await this.userModel.findOne({ email: email });
  }

  async crearUser(user: UserDto) {
   
    const existeCorreo = await this.validarCorreo(user.correo);
    if (existeCorreo) {
    
      return { ...user, registrado: 'No' };
    } else {
      const userBd = {
        ...user,
        password: bcrypt.hashSync(user.password, 10),
      };

      await this.userModel.create(userBd);
      return { ...user, registrado: 'Si' };
    }
  }

  async roles() {
    return ['Instructor', 'Administrator', 'Coordinador'];
  }

  async validarCorreo(email: string): Promise<boolean> {
   
    const user = await this.userModel.findOne({ correo: email });

    if (user) {
        return true;
     
    }
    return false;
  }

  async instructorByProgramaByCentro(programa: string, centro: string) {
    const instructores = await this.userModel.find({
      centro: centro,
      programas: { $in: programa },
      roles: { $in: 'Instructor' },
    });
    if (instructores.length > 0) {
      return instructores;
    }
    throw new NotFoundException(
      `No se encontraron instructores con centro: ${centro}, y programa: ${programa}`,
    );
  }

  async obtenerInstructores() {
    return await this.userModel
      .find({ roles: { $in: 'Instructor' } })
      .populate({
        path: 'centro',
        populate: {
          path: 'regional',
        },
      })
      .populate('programas');
  }

  /* Todos los metodos de actualizar */
  async actualizarUsuario(usuario: ActualizarUserDto) {
    return await this.userModel
      .findByIdAndUpdate(usuario.id, usuario)
      .then((data) => {
        return data
          ? usuario
          : new NotFoundException(
              `No se encontro el usuario con id:${usuario.id}`,
            );
      });
  }

  async obtenerInstructoresPorCentro(centro: string) {
    return await this.userModel
      .find({ roles: { $in: 'Instructor' }, centro: centro })
      .populate({
        path: 'centro',
        populate: {
          path: 'regional',
        },
      })
      .populate('programas');
  }

  async obtenerInstructorPorId(id: string) {
    const instructor = await this.userModel
      .findOne({
        roles: { $in: ['Instructor'] },
        _id: id,
      })
      .populate({
        path: 'centro',
        populate: {
          path: 'regional',
        },
      })
      .populate('programas');

    if (!instructor) {
      throw new NotFoundException(`Instructor con id '${id}' no encontrado`);
    }

    return instructor;
  }

  async obtenerInstructorPorCentro(id: string, centro: string) {
    const instructor = await this.userModel
      .findOne({
        _id: id,
        centro,
        roles: { $in: ['Instructor'] },
      })
      .populate({
        path: 'centro',
        populate: {
          path: 'regional',
        },
      })
      .populate('programas');

    if (!instructor) {
      throw new NotFoundException(`Instructor no encontrado`);
    }

    return instructor;
  }

  async asignarprograma(asignarProgramaDto: AsignarProgramaDto) {
    const { programa, instructores } = asignarProgramaDto;

    const resultado = [];
    var prog = Object();
    prog.nombre = null;
    prog = await this.programaService.obtenerProgramaId(programa);

    for (const idInstructor of instructores) {
      const instructor = await this.obtenerInstructorPorId(idInstructor.id);

      const instructorTieneElPrograma = instructor.programas.some(
        (p) => p._id == programa,
      );

      if (idInstructor.operacion == 1) {
        if (!instructorTieneElPrograma) {
          await this.userModel.updateOne(
            { _id: idInstructor.id },
            { $push: { programas: [programa] } },
          );

          await this.instructoresProgramaModel.updateOne(
            { programa: programa },
            { $push: { instructores: idInstructor.id } },
          );

          resultado.push({
            estado: '1',
            title: 'Asignacion exitosa',
            mensaje: `Al instructor ${instructor.nombre} ${instructor.apellido} se le asigno el programa : ${prog.nombre}`,
          });
        }
      } else {
        try {
          const ope = await this.userModel.findOneAndUpdate(
            { _id: idInstructor.id },
            { $pull: { programas: programa } },
            { new: true }, // Devuelve el documento actualizado
          );

          const pro = await this.instructoresProgramaModel.findOneAndUpdate(
            { programa: programa },
            { $pull: { instructores: idInstructor.id } },
            { new: true }, // Devuelve el documento actualizado
          );

          if (!ope) {
            resultado.push({
              estado: '2',
              title: 'Eliminar programa',
              mensaje: `Al instructor ${instructor.nombre} ${instructor.apellido} se producejo un error al remover el programa : ${prog.nombre}`,
            });
          } else {
            resultado.push({
              estado: '2',
              title: 'Eliminar programa',
              mensaje: `Al instructor ${instructor.nombre} ${instructor.apellido} se elimino el programa : ${prog.nombre}`,
            });
          }
        } catch (error) {
          console.error('Error :', error);
          throw error;
        }

        /* else {
        resultado.push({
          estado: '2',
          instructor: `El instructor ${instructor.nombre} ${instructor.apellido} ya tiene el programa asignado`,
        });
      }*/
      }
    }
    return resultado;
  }

  async eliminarUsuario(id: string) {
    return await this.userModel.findByIdAndRemove(id).then((data) => {
      if (data) {
        return data;
      } else {
        return new NotFoundException(
          `No se encontro el documento con id:${id} en usuarios`,
        );
      }
    });
  }

  async forgotPassword(createEmailDto: CreateEmailDto) {
    const { email } = createEmailDto;
    const usuario = await this.userModel.findOne({ correo: email });

    if (!usuario) {
      throw new NotFoundException(
        `Usuario con correo "${email}" no encontrado`,
      );
    }

    const payload = {
      sub: usuario.id,
      correo: usuario.correo,
      rol: usuario.roles,
    };

    const token = await this.jwtService.signAsync(payload);

    const response = await this.emailService.enviarCorreo({ email }, token);

    console.log({ token });

    return response;
  }

  async resetPassword(
    newPasswordDto: NewPasswordDto,
    headers: IncomingHttpHeaders,
  ) {
    let { authorization } = headers;

    if (authorization.startsWith('Bearer')) {
      authorization = authorization.split(' ')[1];
    }

    try {
      const payload = this.jwtService.verify(authorization);
      const { sub } = payload;

      const newPassword = bcrypt.hashSync(newPasswordDto.newPassword, 10);

      await this.userModel.findByIdAndUpdate(sub, {
        $set: { password: newPassword },
      });
    } catch (error) {
      if (error.name == 'JsonWebTokenError') {
        console.log('Token inválido');
        return;
      }
      console.log(error);
    }
  }
}
