import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Centro } from './schema/centro.schema';
import { ActualizarCentroDto, CentroDto } from './dto/centro.dto';
import { RegionalService } from '../regional/regional.service';

@Injectable()
export class CentroService {
  constructor(
    @InjectModel(Centro.name) private centroModel: Model<Centro>,
    @Inject(RegionalService) private regionalService: RegionalService,
  ) {}

  async obtenerTodo(): Promise<NotFoundException | Centro[]> {
    return await this.centroModel
      .find()
      .populate('regional')
      .then((data) => {
        if (data) {
          return data;
        } else {
          return new NotFoundException(
            'No se encontraron documentos en centros',
          );
        }
      });
  }

  async crearCentro(
    centro_dto: CentroDto,
  ): Promise<NotFoundException | object> {
    try {
      const exitsRegional = await this.regionalService
        .checkById(centro_dto.regional)
        .then((data) => {
          return data ? true : false;
        });

      if (exitsRegional) {
        const centro = new this.centroModel(centro_dto);
        return await centro.save();
      } else {
        return new NotFoundException('La regional no existe');
      }
    } catch (error) {
      return {
        'Error al crear el centro': `${error}`,
      };
    }
  }

  async eliminarCentro(id: string) {
    return await this.centroModel.findByIdAndRemove(id).then((data) => {
      if (data) {
        return data;
      } else {
        return new NotFoundException(
          `No se encontró el documento con id:${id} en centro`,
        );
      }
    });
  }

  async actualizarCentro(
    centro_dto: ActualizarCentroDto,
  ): Promise<NotFoundException | Centro> {
    return await this.centroModel
      .findByIdAndUpdate(centro_dto.id, centro_dto)
      .then((data) => (data ? data : new NotFoundException(centro_dto)));
  }

  async centroPorId(id: string) {
    try {
      return await this.centroModel
        .findOne({
          _id: id,
        })
        .populate({
          path: 'regional',
        });
    } catch (error) {
      return new NotFoundException(`Error al hacer la búsqueda: ${error}`);
    }
  }
}
