import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { AsignarProgramaDto } from './dto/asignarprograma.dto';
import { ProgramaService } from 'src/programa/programa.service';
import { InstructoresPrograma } from 'src/programa/schema/instructoresprograma.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(InstructoresPrograma.name)
    private instructoresProgramaModel: Model<InstructoresPrograma>,
    private readonly programaService: ProgramaService,
  ) {}

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
      return new BadRequestException(
        `El usuario con el correo ${user.correo} ya existe`,
      );
    }
    const userBd = {
      ...user,
      password: bcrypt.hashSync(user.password, 10),
    };

    return await this.userModel.create(userBd);
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

    for (const idInstructor of instructores) {
      const instructor = await this.obtenerInstructorPorId(idInstructor);

      const instructorTieneElPrograma = instructor.programas.some(
        (p) => p._id == programa,
      );

      if (!instructorTieneElPrograma) {
        await this.userModel.updateOne(
          { _id: idInstructor },
          { $push: { programas: [programa] } },
        );

        await this.instructoresProgramaModel.updateOne(
          { programa: programa },
          { $push: { instructores: idInstructor } },
        );

        resultado.push({
          estado: '1',
          instructor: `Al instructor ${instructor.nombre} ${instructor.apellido} se le asigno el programa`,
        });
      } else {
        resultado.push({
          estado: '2',
          instructor: `El instructor ${instructor.nombre} ${instructor.apellido} ya tiene el programa asignado`,
        });
      }
    }
    return resultado;
  }
}
