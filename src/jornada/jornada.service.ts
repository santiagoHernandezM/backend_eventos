import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jornada } from './schema/jornada.schema';
import { CrearJornadaDto, ActualizarJornadaDto } from './dto/jornada.dto';

@Injectable()
export class JornadaService {
  constructor(
    @InjectModel(Jornada.name) private jornadaModel: Model<Jornada>,
  ) {}

  async obtenerJornadas() {
    return await this.jornadaModel.find().then((data) => {
      return data
        ? data
        : new NotFoundException('No se encontraron documentos en jornada');
    });
  }

  async obtenerJornada(id: string) {
    return await this.jornadaModel.findById(id).then((data) => {
      return data
        ? data
        : new NotFoundException(`No se encontro la jornada con id:${id}`);
    });
  }

  async crearJornada(jornadaDto: CrearJornadaDto) {
    return await this.jornadaModel.create(jornadaDto);
  }

  async actualizarJornada(jornadaDto: ActualizarJornadaDto) {
    return await this.jornadaModel
      .findByIdAndUpdate(jornadaDto.id, jornadaDto)
      .then((data) => {
        return data
          ? data
          : new NotFoundException(
              `No se encontro la jornada con id:${jornadaDto.id}`,
            );
      })
      .catch((err) => {
        return new HttpException(err, HttpStatus.CONFLICT);
      });
  }

  async eliminarJornada(id: string) {
    return await this.jornadaModel
      .findByIdAndDelete(id)
      .then((data) => {
        return data
          ? data
          : new NotFoundException(`No se encontro jornada con id:${id}`);
      })
      .catch((err) => {
        return new HttpException(err, HttpStatus.CONFLICT);
      });
  }
}
