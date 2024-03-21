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
import { AsignarProgramasDto } from './dto/asignarprogramas.dto';
import { ProgramaService } from 'src/programa/programa.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly programaService: ProgramaService,
  ) {}

  async findOne(name: string) {
    return this.userModel
      .findOne({ name })
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
    return new NotFoundException(
      `No se encontraron instructores con centro: ${centro}, y programas: ${programa}`,
    );
  }

  async getInstructor() {
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

  async getInstructorById(id: string) {
    return await this.userModel
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
  }

  async asignarprogramas(asignarProgramasDto: AsignarProgramasDto) {
    const { programa, instructores } = asignarProgramasDto;

    const invalidos = []

    for (const idInstructor of instructores) {
      const instructor = await this.getInstructorById(idInstructor);

      const instructorTieneElPrograma = instructor.programas.some(
        (p) => p._id == programa,
      );

      if (!instructorTieneElPrograma) {
        await this.userModel.findByIdAndUpdate(idInstructor, {
        //  $set: { programas: [...instructor.programas, programa] },
        $push: { programas: [programa] },
        });

        invalidos.push(
          {
            'estado' : '1',
            'instructor' : `El instructor ${instructor.nombre} ${instructor.apellido} se le asigno el programa`
          })

      } else {
        invalidos.push(
          {
            'estado' : '2',
            'instructor' : `El instructor ${instructor.nombre} ${instructor.apellido} ya tiene el programa asignado`
          })
      }
    }
    return invalidos;
  }
}
