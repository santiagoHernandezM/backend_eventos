import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Ficha } from './schema/ficha.schema';
import { ActualizarFichaDto, FichaDto } from './dto/ficha.dto';
import { CompetenciaService } from 'src/competencia/competencia.service';
import { ProgramaService } from 'src/programa/programa.service';
import { GestorTService } from 'src/gestor-t/gestor-t.service';
import path from 'path';

@Injectable()
export class FichaService {
  constructor(
    @InjectModel(Ficha.name) private fichaModel: Model<Ficha>,
    @Inject(CompetenciaService) readonly competenciaService: CompetenciaService,
    @Inject(ProgramaService) readonly programaService: ProgramaService,
    @Inject(GestorTService) readonly gestorTService: GestorTService,
  ) {}

  async obtenerTodo() {
    return await this.fichaModel
      .find()
      .populate('instructor')
      .populate('ambiente')
      .populate('programa')
      .populate({
        path: 'ambiente',
        populate: [
          {
            path: 'bloque',
            populate: {
              path: 'sede',
              populate: {
                path: 'centro',
                populate: {
                  path: 'regional',
                },
              },
            },
          },
        ],
      });
  }

  async obtenerFicha(id: string) {
    return await this.fichaModel
      .findById(id)
      .populate('ambiente')
      .populate('programa')
      .populate('instructor')
      .populate({
        path: 'ambiente',
        populate: [
          {
            path: 'bloque',
            populate: {
              path: 'sede',
              populate: {
                path: 'centro',
                populate: {
                  path: 'regional',
                },
              },
            },
          },
        ],
      })
      .then((ficha) => {
        return ficha
          ? ficha
          : new NotFoundException(`No se encontro la ficha con id:${id}`);
      });
  }

  async crearFicha(fichaDto: FichaDto) {
    let gestor;
    return await this.fichaModel.create(fichaDto).then((fichaCreada) => {
      return this.competenciaService
        .obtenerCompetenciasPorPrograma(fichaDto.programa)
        .then((competenciasM: any) => {
          return this.programaService
            .obtenerDuracion(fichaDto.programa)
            .then((duracion) => {
              gestor = {
                ficha: fichaCreada._id,
                duracion: duracion,
                acumulado: 0,
                competencias: [],
              };
              competenciasM[0].competencias.map((competencias: any) => {
                competencias.acumulado = 0;
                competencias.resultados.map((resultado) => {
                  resultado.acumulado = 0;
                });
                gestor.competencias.push(competencias);
              });
              this.gestorTService.crearGestor(gestor);
              return fichaCreada;
            });
        });
    });
  }

  async actualizarFicha(
    ficha: ActualizarFichaDto,
  ): Promise<NotFoundException | Ficha> {
    return await this.fichaModel
      .findByIdAndUpdate(ficha.id, ficha)
      .then((ficha) => {
        return ficha
          ? ficha
          : new NotFoundException(
              `No se pudo actualizar la ficha con id:${ficha.id}`,
            );
      });
  }

  async eliminarFicha(id: string) {
    return await this.fichaModel.findByIdAndDelete(id).then((ficha) => {
      return ficha
        ? ficha
        : new NotFoundException(`No se encontró la ficha con id:${id}`);
    });
  }

  async obtenerFichasPorPrograma(id: string): Promise<Ficha[] | []> {
    return await this.fichaModel
      .find({ programa: id })
      .populate('sede')
      .populate('ambiente')
      .populate('programa')
      .populate('instructor');
  }

  async obtenerFichasPorCentro(idProgramas: string, idCentro: string): Promise<Ficha[] | []> {
    const _idProgramas = [];
    try {
      idProgramas.split(',').forEach(idPrograma => {
        _idProgramas.push(new mongoose.Types.ObjectId(idPrograma));
      });
    } catch (error) {
      return [];
    }
    
    return await this.fichaModel
      .aggregate([
        {
          $match: {
            'programa': {$in: _idProgramas}
          },
        },
        {
          $lookup: {
            from: 'sedes',
            localField: 'sede',
            foreignField: '_id',
            as: 'sede',
          },
        },
        {
          $unwind: '$sede',
        },
        {
          $match: {
            'sede.centro': new mongoose.Types.ObjectId(idCentro),
          },
        },
        {
          $lookup: {
            from: 'ambientes',
            localField: 'ambiente',
            foreignField: '_id',
            as: 'ambiente',
          },
        },
        {
          $unwind: '$ambiente',
        },
        {
          $lookup: {
            from: 'bloques',
            localField: 'ambiente.bloque',
            foreignField: '_id',
            as: 'ambiente.bloque'
          }
        },
        {
          $unwind: '$ambiente.bloque'
        },
        {
          $lookup: {
            from: 'sedes',
            localField: 'ambiente.bloque.sede',
            foreignField: '_id',
            as: 'ambiente.bloque.sede'
          }
        },
        {
          $unwind: '$ambiente.bloque.sede'
        },
        {
          $lookup: {
            from: 'centros',
            localField: 'ambiente.bloque.sede.centro',
            foreignField: '_id',
            as: 'ambiente.bloque.sede.centro'
          }
        },
        {
          $unwind: '$ambiente.bloque.sede.centro'
        },
        {
          $lookup: {
            from: 'regionals',
            localField: 'ambiente.bloque.sede.centro.regional',
            foreignField: '_id',
            as: 'ambiente.bloque.sede.centro.regional'
          }
        },
        {
          $unwind: '$ambiente.bloque.sede.centro.regional'
        },
        {
          $lookup: {
            from: 'programas',
            localField: 'programa',
            foreignField: '_id',
            as: 'programa',
          },
        },
        {
          $unwind: '$programa',
        },
        {
          $lookup: {
            from: 'users',
            localField: 'instructor',
            foreignField: '_id',
            as: 'instructor',
          },
        },
        {
          $unwind: '$instructor',
        },
        {
          $project: {
            codigo: 1,
            sede: '$sede._id',
            ambiente: {
              _id: '$ambiente._id',
              codigo: '$ambiente.codigo',
              bloque: {
                _id: '$ambiente.bloque._id',
                nombre: '$ambiente.bloque.nombre',
                nomenclatura: '$ambiente.bloque.nomenclatura',
                sede: {
                  _id: '$ambiente.bloque.sede._id',
                  nombre: '$ambiente.bloque.sede.nombre',
                  centro: {
                    _id: '$ambiente.bloque.sede.centro._id',
                    codigo: '$ambiente.bloque.sede.centro.codigo',
                    nombre: '$ambiente.bloque.sede.centro.nombre',
                    regional: {
                      _id: '$ambiente.bloque.sede.centro.regional._id',
                      codigo: '$ambiente.bloque.sede.centro.regional.codigo',
                      nombre: '$ambiente.bloque.sede.centro.regional.nombre',
                      municipio: '$ambiente.bloque.sede.centro.regional.municipio',
                      departamento: '$ambiente.bloque.sede.centro.regional.departamento',
                      __v: '$ambiente.bloque.sede.centro.regional.__v',
                    },
                    municipio: '$ambiente.bloque.sede.centro.municipio',
                    __v: '$ambiente.bloque.sede.centro.__v',
                  },
                  lugar_funcionamiento: '$ambiente.bloque.sede.lugar_funcionamiento',
                  departamento: '$ambiente.bloque.sede.departamento',
                  municipio: '$ambiente.bloque.sede.municipio',
                  __v: '$ambiente.bloque.sede.__v'
                },
                __v: '$ambiente.bloque.__v'
              },
              tipo: '$ambiente.tipo',
              sede: '$ambiente.sede',
              __v: '$ambiente.__v'
            },
            programa:{
              _id: '$programa._id',
              codigo: '$programa.codigo',
              nombre: '$programa.nombre',
              nivel: '$programa.nivel',
              version: '$programa.version',
              duracion: '$programa.duracion',
              intensidad_horaria: '$programa.intensidad_horaria',
              __v: '$programa.__v'
            },
            instructor: {
              _id: '$instructor._id',
              documento: '$instructor.documento',
              nombre: '$instructor.nombre',
              apellido: '$instructor.apellido',
              correo: '$instructor.correo',
              celular: '$instructor.celular',
              contrato: 1,
              programas: '$instructor.programas',
              centro: '$instructor.centro',
              roles: '$instructor.roles',
              __v: '$instructor.__v',
            },
            jornadas: 1
          },
        },
      ]
    );
  }

  /**
   * Buscar Fichas por programa y por sede
   * @param idPrograma: string ObjectId del Programa asociado a la Ficha
   * @param idSede: string ObjectId de la Sede asociado a la Ficha
   */
  async fichaPorProgramaYSede(idPrograma: string, idSede: string) {
    return await this.fichaModel
      .find({
        programa: idPrograma,
        sede: idSede,
      })
      .populate({
        path: 'sede',
      })
      .populate({
        path: 'ambiente',
      })
      .populate({
        path: 'programa',
      })
      .populate({
        path: 'instructor',
      });
  }
}
