import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TipoDeVinculacion } from './schema/tipo-de-vinculacion.schema';
import {
  TipoDeVinculacionDto,
  ActualizarTipoDeVinculacionDto,
} from './dto/tipo-de-vinculacion.dto';

@Injectable()
export class TipoDeVinculacionService {
  constructor(
    @InjectModel(TipoDeVinculacion.name)
    private tipoDeVinculacionModel: Model<TipoDeVinculacion>,
  ) {}

  async obtenerTipoDeVinculaciones() {
    return await this.tipoDeVinculacionModel.find();
  }

  async obtenerTipoVinculacion(
    id: string,
  ): Promise<NotFoundException | TipoDeVinculacion> {
    return await this.tipoDeVinculacionModel
      .findById(id)
      .then((tVinculacion) => {
        return tVinculacion
          ? tVinculacion
          : new NotFoundException(
              `No existe el tipo de vinculación con id: ${id}`,
            );
      });
  }
  /*async existeTipoVinculacion(id: string): Promise<boolean> {
    return await this.tipoDeVinculacionModel
      .findById(id)
      .then((vinculacion) => {
        return vinculacion ? true : false;
      });
  }*/
  async crearTipoDeVinculacion(tipoDeVinculacionDto: TipoDeVinculacionDto) {
    const existeDocumento = await this.tipoDeVinculacionModel.findOne({
      nombre: tipoDeVinculacionDto.nombre,
    });

    return existeDocumento
      ? new HttpException(
          'El nivel de formación ya existe',
          HttpStatus.CONFLICT,
        )
      : await this.tipoDeVinculacionModel.create(tipoDeVinculacionDto);
  }

  async actualizarTipoDeVinculacion(
    tipoDeVinculacionDto: ActualizarTipoDeVinculacionDto,
  ) {
    return await this.tipoDeVinculacionModel
      .findByIdAndUpdate(tipoDeVinculacionDto.id, tipoDeVinculacionDto)
      .then((data) => {
        return data
          ? data
          : new NotFoundException(
              `No se encontro el tipo de vinculación con id:${tipoDeVinculacionDto.id}`,
            );
      })
      .catch((err) => {
        return new HttpException(err, HttpStatus.CONFLICT);
      });
  }

  async eliminarTipoDeVinculacion(id: string) {
    return await this.tipoDeVinculacionModel
      .findByIdAndRemove(id)
      .then((data) => {
        return data
          ? data
          : new NotFoundException(
              `No se encontro el tipo de vinculación con id:${id}`,
            );
      })
      .catch((err) => {
        return new HttpException(err, HttpStatus.CONFLICT);
      });
  }
}
