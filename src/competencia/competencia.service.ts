import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Competencia } from './schema/competencia.schema';
import {
  actualizarCompetenciaDto,
  competenciaDto,
} from './dto/competencia.dto';

@Injectable()
export class CompetenciaService {
  constructor(
    @InjectModel(Competencia.name) private competenciaModel: Model<Competencia>,
  ) {}

  // obtener todas las competencias
  async obtenerCompetencias(): Promise<Competencia[]> {
    return await this.competenciaModel.find().exec();
  }

  // competencias por programa
  async obtenerCompetenciasPorPrograma(
    programa: string,
  ): Promise<Competencia[]> {
    return await this.competenciaModel.find({ programa: programa }).exec();
  }

  // competencia por codigos
  async obtenerCompetenciaPorCodigo(
    idPrograma: string,
    cocompetencia: string,
  ): Promise<Competencia> {
    return await this.competenciaModel
      .findOne({
        programa: idPrograma,
        'competencias.codigo': cocompetencia,
      })
      .exec();
  }

  // crear competencia
  async crearCompetencia(competencia: competenciaDto): Promise<Competencia> {
    const newCompetencia = new this.competenciaModel(competencia);
    return await newCompetencia.save();
  }

  // ac
  async actualizarResultados(
    competencia: actualizarCompetenciaDto,
  ): Promise<NotFoundException | Competencia> {
    // obtener competencia
    return await this.competenciaModel
      .findByIdAndUpdate(competencia.id, competencia)
      .then((data) => {
        return data
          ? data
          : new NotFoundException(
              `No se encontro el bloque con id:${competencia.id}`,
            );
      })
      .catch((err) => {
        return new HttpException(err, HttpStatus.CONFLICT);
      });
  }
}
