import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Programa } from './schema/programa.schema';
import { Model } from 'mongoose';
import { ActualizarProgramaDto, ProgramaDto } from './dto/programa.dto';

@Injectable()
export class ProgramaService {
  constructor(
    @InjectModel(Programa.name) private ProgramaModel: Model<Programa>,
  ) {}

  /* Todos los metodos de obtener */
  async obtenerTodo(): Promise<NotFoundException | Programa[]> {
    return await this.ProgramaModel.find().then((data) => {
      if (data) {
        return data;
      } else {
        return new NotFoundException(
          'No se encontraron documentos en programas',
        );
      }
    });
  }
  async obtenerProgramaId(id: string): Promise<NotFoundException | Programa> {
    return await this.ProgramaModel.findById(id).then((data) => {
      if (data) {
        return data;
      } else {
        return new NotFoundException('No hay programas con ese id');
      }
    });
  }
  async obtenerProgramaPorIntensidad(id: string, intensidad: number) {
    return await this.ProgramaModel.findOne({
      _id: id,
      intensidad_horaria: intensidad,
    }).then((data) => {
      return data
        ? data
        : new NotFoundException(
            `No se encontro el programa objectId: ${id} y la intensidad ${intensidad}`,
          );
    });
  }

  /* Todos los metodos de crear */
  async crearPrograma(
    ProgramaDto: ProgramaDto,
  ): Promise<NotFoundException | Programa> {
    let existe: any = await this.ProgramaModel.exists({
      codigo: ProgramaDto.codigo,
      intensidad_horaria: ProgramaDto.intensidad_horaria,
    });
    existe === null ? (existe = false) : (existe = true);
    if (existe) {
      return new NotFoundException(
        `Ya existe un programa con el codigo ${ProgramaDto.codigo}`,
      );
    }
    const Programa = new this.ProgramaModel(ProgramaDto);
    return await Programa.save();
  }

  /* Todos los metodos de borrar */

  async borrarPrograma(id: string) {
    return await this.ProgramaModel.findByIdAndRemove(id).then((data) => {
      if (data) {
        return data;
      } else {
        return new NotFoundException(
          `No se encontro el documento con id:${id} en programas`,
        );
      }
    });
  }

  /* Todos los metodos de actualizar */
  async actualizarPrograma(programa: ActualizarProgramaDto) {
    return await this.ProgramaModel.findByIdAndUpdate(
      programa.id,
      programa,
    ).then((data) => {
      return data
        ? data
        : new NotFoundException(
            `No se encontro el programa con id:${programa.id}`,
          );
    });
  }
  async obtenerDuracion(id) {
    return await this.ProgramaModel.findById(id).then((programa) => {
      return programa.duracion;
    });
  }
}
