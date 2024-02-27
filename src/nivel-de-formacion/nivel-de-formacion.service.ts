import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NivelDeFormacion } from './schema/nivel-de-formacion.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  NivelDeFormacionDto,
  ActualizarNivelDeFormacionDto,
} from './dto/nivel-de-formacion.dto';

@Injectable()
export class NivelDeFormacionService {
  constructor(
    @InjectModel(NivelDeFormacion.name)
    private nivelDeFormacionModel: Model<NivelDeFormacion>,
  ) {}

  async obtenerNivelesDeFormacion() {
    return await this.nivelDeFormacionModel.find();
  }

  async crearNivelDeFormacion(nivelDeFormacionDto: NivelDeFormacionDto) {
    // validar que no exista un nivel de formación con el mismo nombre
    const existeDocumento = await this.nivelDeFormacionModel.findOne({
      nombre: nivelDeFormacionDto.nombre,
    });

    return existeDocumento
      ? new HttpException(
          'El nivel de formación ya existe',
          HttpStatus.CONFLICT,
        )
      : await this.nivelDeFormacionModel.create(nivelDeFormacionDto);
  }

  async actualizarNivelDeFormacion(
    nivelDeFormacionDto: ActualizarNivelDeFormacionDto,
  ) {
    return await this.nivelDeFormacionModel
      .findByIdAndUpdate(nivelDeFormacionDto.id, nivelDeFormacionDto)
      .then((data) => {
        return data
          ? data
          : new NotFoundException(
              `No se encontro el bloque con id:${nivelDeFormacionDto.id}`,
            );
      })
      .catch((err) => {
        return new HttpException(err, HttpStatus.CONFLICT);
      });
  }

  async eliminarNivelDeFormacion(id: string) {
    return await this.nivelDeFormacionModel
      .findByIdAndRemove(id)
      .then((data) => {
        return data
          ? data
          : new NotFoundException(`No se encontro el bloque con id:${id}`);
      })
      .catch((err) => {
        return new HttpException(err, HttpStatus.CONFLICT);
      });
  }
}
