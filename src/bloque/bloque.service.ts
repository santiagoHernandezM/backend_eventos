import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Bloque } from './schema/bloque.schema';
import { CrearBloqueDto, ActualizarBloqueDto } from './dto/bloque.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BloqueService {
  constructor(@InjectModel(Bloque.name) private bloqueModel: Model<Bloque>) {}

  async obtenerBloques() {
    return await this.bloqueModel.find()
    .populate('sede')
    .then((data) => {
      return data
        ? data
        : new NotFoundException('No se encontraron documentos en bloque');
    });
  }

  async obtenerBloque(id: string) {
    return await this.bloqueModel.findById(id).then((data) => {
      return data
        ? data
        : new NotFoundException(`No se encontro el bloque con id:${id}`);
    });
  }

  async crearBloque(bloqueDto: CrearBloqueDto) {
    const existeBloque = await this.bloqueModel.findOne({
      nomenclatura: bloqueDto.nomenclatura,
      sede : bloqueDto.sede
    });

    return existeBloque
      ? new HttpException('El ambiente ya existe', HttpStatus.CONFLICT)
      : await this.bloqueModel.create(bloqueDto);
  }

  async actualizarBloque(bloqueDto: ActualizarBloqueDto) {
    return await this.bloqueModel
      .findByIdAndUpdate(bloqueDto.id, bloqueDto)
      .then((data) => {
        return data
          ? data
          : new NotFoundException(
              `No se encontro el bloque con id:${bloqueDto.id}`,
            );
      })
      .catch((err) => {
        return new HttpException(err, HttpStatus.CONFLICT);
      });
  }

  async eliminarBloque(id: string) {
    return await this.bloqueModel
      .findByIdAndDelete(id)
      .then((data) => {
        return data
          ? data
          : new NotFoundException(`No se encontro el bloque con id:${id}`);
      })
      .catch((err) => {
        return new HttpException(err, HttpStatus.CONFLICT);
      });
  }

  async getBloqueForSede(id: string) {
    return await this.bloqueModel.find({ sede: id }).then((data) => {
      if (data) {
        return data;
      }
      return new NotFoundException(`No se encontro bloques son sedes (${id})`);
    });
  }
}
