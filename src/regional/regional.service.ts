import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ActualizarRegionalDto, RegionalDto } from './dto/regional.dto';
import { Regional } from './schema/regional.schema';
@Injectable()
export class RegionalService {
  constructor(
    @InjectModel(Regional.name) private regionalModel: Model<Regional>,
  ) {}

  // obtener todas las regionales
  async obtenerRegionales(): Promise<NotFoundException | Regional[]> {
    return await this.regionalModel.find().then((data) => {
      if (data) {
        return data;
      } else {
        throw new NotFoundException(
          'No se encontraron documentos en regionales',
        );
      }
    });
  }
  // obtener una regional
  async obtenerRegionalId(id: string): Promise<NotFoundException | Regional> {
    return await this.regionalModel.findById(id).then((data) => {
      if (data) {
        return data;
      } else {
        return new NotFoundException('No se encontró la regional');
      }
    });
  }

  async checkById(id: string): Promise<boolean | string> {
    return await this.regionalModel.findById(id).then((data) => {
      return data ? true : false;
    });
  }

  async crearRegional(regional_dto: RegionalDto): Promise<Regional> {
    try {
      const exitsRegional = await this.regionalModel.findOne({
        codigo: regional_dto.codigo,
      });

      if (exitsRegional) {
        throw new NotFoundException(
          `Ya existe una regional con el codigo: ${regional_dto.codigo}`,
        );
      }

      const nuevaRegional = new this.regionalModel(regional_dto);
      return await nuevaRegional.save();
    } catch (error) {
      return error;
    }
  }

  // eliminar una regional
  async eliminarRegional(id: string) {
    return await this.regionalModel.findByIdAndRemove(id).then((data) => {
      return data
        ? data
        : new NotFoundException(
            `No se encontro el documento con id:${id} en regionales`,
          );
    });
  }
  // actualizar una regional
  // async update_regional(id: string, regional_dto: Regional_Dto) {
  //   return await this.regionalModel
  //     .findByIdAndUpdate(id, regional_dto)
  //     .then((data) => {
  //       if (data) {
  //         return data;
  //       } else {
  //         return 'No se encontro la regional';
  //       }
  //     });
  // }

  // actualizar una regional
  async actualizarRegional(regional_dto: ActualizarRegionalDto) {
    return await this.regionalModel
      .findByIdAndUpdate(regional_dto.id, regional_dto)
      .then((data) => {
        if (data) {
          return `Se actualizo la regional con id: ${regional_dto.id}`;
        } else {
          return `No se encontro la regional con id: ${regional_dto.id}`;
        }
      });
  }
}
