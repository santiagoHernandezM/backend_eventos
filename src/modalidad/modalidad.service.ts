import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Modalidad } from './schema/modalidad.schema';
import { Model } from 'mongoose';
import { ActualizarModalidadDto, ModalidadDto } from './dto/modalidad.dto';

@Injectable()
export class ModalidadService {
  constructor(
    @InjectModel(Modalidad.name) private modalidadModel: Model<Modalidad>,
  ) {}
  async obtenerModalidades(): Promise<NotFoundException | Modalidad[]> {
    return await this.modalidadModel.find().then((modalidades) => {
      return modalidades
        ? modalidades
        : new NotFoundException('No se encontraron niveles de modalidades');
    });
  }

  async obtenerModalidad(id: string): Promise<NotFoundException | Modalidad> {
    return await this.modalidadModel.findById(id).then((modalidad) => {
      return modalidad
        ? modalidad
        : new NotFoundException(
            `No existe la el nivel de modalidad con id: ${id}`,
          );
    });
  }

  async crearModalidad(
    modalidadDto: ModalidadDto,
  ): Promise<string | Modalidad> {
    const modalidad = new this.modalidadModel(modalidadDto);

    const existeModalidad = await this.existeNombreModalidad(modalidad.nombre);
    if (!existeModalidad) {
      return await modalidad.save();
    }
    return `Ya existe un nivel de modalidad con el nombre: ${modalidad.nombre}`;
  }

  async actualizarModalidad(
    modalidadDto: ActualizarModalidadDto,
  ): Promise<NotFoundException | Modalidad> {
    const existeModalidad = await this.existeNombreModalidad(
      modalidadDto.nombre,
    );
    if (!existeModalidad) {
      return await this.modalidadModel
        .findByIdAndUpdate(modalidadDto.id, modalidadDto)
        .then((modalidad) => {
          return modalidad
            ? modalidad
            : new NotFoundException(
                `No existe el nivel de modalidad con id: ${modalidadDto.id}`,
              );
        });
    }
    return new NotFoundException(
      `No se puede actualizar el nivel de modalidad: ${modalidadDto.nombre}, ya existe uno con ese nombre`,
    );
  }

  async eliminarModalidad(id: string): Promise<NotFoundException | string> {
    return await this.modalidadModel.findByIdAndDelete(id).then((modalidad) => {
      return modalidad
        ? `Modalidad eliminada: ${modalidad}`
        : new NotFoundException(
            `No se pudo eliminar la modalidad con id: ${id}`,
          );
    });
  }

  async existeNombreModalidad(nombre: string): Promise<boolean> {
    return await this.modalidadModel
      .findOne({ nombre: { $regex: new RegExp(`^${nombre}$`, 'i') } })
      .then((modalidad) => {
        return modalidad ? true : false;
      });
  }
}
