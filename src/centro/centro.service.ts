import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Centro } from './schema/centro.schema';
import { ActualizarCentroDto, CentroDto } from './dto/centro.dto';
import { RegionalService } from '../regional/regional.service';
import { Sede } from 'src/sedes/schema/sede.schema';
import { Bloque } from 'src/bloque/schema/bloque.schema';
import { Ambiente } from 'src/ambiente/schemas/ambiente.schema';

@Injectable()
export class CentroService {
  constructor(
    @InjectModel(Centro.name) private centroModel: Model<Centro>,
    @InjectModel(Sede.name) private sedeModel: Model<Sede>,
    @InjectModel(Bloque.name) private bloqueModel: Model<Bloque>,
    @InjectModel(Ambiente.name) private ambienteModel: Model<Ambiente>,
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
    try {
      // se deben eliminar las sedes, los bloques, los ambientes, y las fichas asociadas
      const sedes = await this.sedeModel.find({ centro: id });
      console.log(sedes);

      if (sedes.length > 0) {
        sedes.forEach(async ({ _id }) => {
          const bloques = await this.bloqueModel.find({ sede: _id });
          if (bloques.length > 0) {
            await this.bloqueModel.deleteMany({ sede: _id });
          }

          const ambientes = await this.ambienteModel.find({ sede: _id });
          if (ambientes.length > 0) {
            await this.ambienteModel.deleteMany({ sede: _id });
          }
        });

        await this.sedeModel.deleteMany({ centro: id });
      }
    } catch (error) {
      console.log(error);
    }

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

  async getCentroByNombre(nombre: string) {
    return await this.centroModel
      .findOne({
        nombre,
      })
      .populate('regional');
  }
}
