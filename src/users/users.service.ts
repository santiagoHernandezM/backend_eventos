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

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(name: string) {
    return this.userModel.findOne({ name });
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
    return await this.userModel.find({ roles: { $in: 'Instructor' } });
  }
  async getInstructorById(id: string) {
    return await this.userModel.findOne({
      roles: { $in: ['Instructor'] },
      _id: id,
    });
  }
}
