import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TipoAmbiente } from './schemas/tipo-ambiente.schema';
import { CreatedTipoAmbienteDTO, UpdateTipoAmbienteDTO } from './dto/tipo-ambiente.dto';

@Injectable()
export class TipoAmbienteService {
  constructor(
    @InjectModel(TipoAmbiente.name)
    private readonly tipoAmbienteModel: Model<TipoAmbiente>,
  ) {}

  async getAllTipos(): Promise<TipoAmbiente[]> {
    return await this.tipoAmbienteModel.find().then((dato) => {
      if (!dato)
        throw new HttpException(
          'no se encontraron registros',
          HttpStatus.NOT_FOUND,
        );
      else return dato;
    });
  }

  async getByIdTipos(idTipo: string): Promise<TipoAmbiente> {
    const found = await this.tipoAmbienteModel.findById(idTipo).then((dato) => {
      if (!dato)
        throw new HttpException(
          'el registro no existe!!',
          HttpStatus.NOT_FOUND,
        );
      else return dato;
    });
    return found;
  }

  async createdTipoAmb(
    tipoAmbiente: CreatedTipoAmbienteDTO,
  ): Promise<TipoAmbiente> {
    const found = await this.tipoAmbienteModel.findOne({
      codigo: tipoAmbiente.codigo,
    });
    if (found)
      throw new HttpException(`el registro ya existe`, HttpStatus.CONFLICT);
    const newTipo = new this.tipoAmbienteModel(tipoAmbiente);
    return await newTipo.save();
  }

  async actualizarTipoAmb(updateTipoAmbienteDTO: UpdateTipoAmbienteDTO) {
    return await this.tipoAmbienteModel
      .findByIdAndUpdate(updateTipoAmbienteDTO.id, updateTipoAmbienteDTO)
      .then((data) => {
        return data
          ? data
          : new NotFoundException(
              `No se encontro el tipoAmbiente con id:${updateTipoAmbienteDTO.id}`,
            );
      })
      .catch((err) => {
        return new HttpException(err, HttpStatus.CONFLICT);
      });
  }

  async eliminarTipoAmb(id: string) {
    return await this.tipoAmbienteModel
      .findByIdAndDelete(id)
      .then((data) => {
        return data
          ? data
          : new NotFoundException(`No se encontro el tipoAmbiente con id:${id}`);
      })
      .catch((err) => {
        return new HttpException(err, HttpStatus.CONFLICT);
      });
  }
}
