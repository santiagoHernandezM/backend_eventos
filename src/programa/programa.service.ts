import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Programa } from './schema/programa.schema';
import { Model } from 'mongoose';
import { ActualizarProgramaDto, ProgramaDto } from './dto/programa.dto';
import { InstructoresPrograma } from './schema/instructoresprograma.schema';
import { CompetenciaService } from 'src/competencia/competencia.service';

@Injectable()
export class ProgramaService {

  constructor(
    @InjectModel(Programa.name) private ProgramaModel: Model<Programa>,
    @InjectModel(InstructoresPrograma.name)
    private instructoresProgramaModel: Model<InstructoresPrograma>,
    private readonly competencias: CompetenciaService
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

  async  programacompetencia(): Promise<NotFoundException | Programa[]> {
    return await this.ProgramaModel.find().then( async (data) =>  {
      const solver = []
     if (data) {
        for (let elemento of data )
        {
             let objeto = JSON.parse(JSON.stringify(elemento))
             objeto.competencia = null
             const resp =  await this.competencias.obtenerCompetenciasPorPrograma(elemento._id.toString())
             
            if (resp.length > 0) 
               {
                objeto.competencia = resp[0]
               }
           solver.push(objeto)
        }
        return solver;
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

  async obtenerInstructoresPorPrograma(programa: string) {
    return await this.instructoresProgramaModel
      .findOne({ programa })
      .then((data) => {
        if (data) {
          return data;
        } else {
          return new NotFoundException('No hay programas con ese id');
        }
      });
  }

  /* Todos los metodos de crear */
  async crearPrograma(
    ProgramaDto: ProgramaDto,
  ): Promise<NotFoundException | Programa> {
    let existe: any = await this.ProgramaModel.exists({
      codigo: ProgramaDto.codigo,
      version: ProgramaDto.version,
      intensidad_horaria: ProgramaDto.intensidad_horaria,
    });

    existe === null ? (existe = false) : (existe = true);

    if (existe) {
      return new NotFoundException(
        `Ya existe un programa con el codigo ${ProgramaDto.codigo} y la versión ${ProgramaDto.version}`,
      );
    }

    const Programa = new this.ProgramaModel(ProgramaDto);
    const { _id } = await Programa.save();

    await this.instructoresProgramaModel.create({
      programa: _id,
      instructores: [],
    });
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
        ? programa
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
