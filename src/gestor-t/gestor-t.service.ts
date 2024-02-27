import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GestorTDto } from './dto/gestor-t.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Gestor } from './schema/gestor-t.schema';
import { Model } from 'mongoose';
import { RestarTiempoFichaDto } from './dto/restarTiempoFicha.dto';

@Injectable()
export class GestorTService {
  constructor(@InjectModel(Gestor.name) private gestorTModel: Model<Gestor>) {}
  async crearGestor(gestorTDto: GestorTDto) {
    const existeGestor = await this.existeGestor(gestorTDto.ficha);
    if (!existeGestor) {
      return await this.gestorTModel.create(gestorTDto);
    }
    return new ConflictException(
      `El gestor de tiempo para la ficha: ${gestorTDto.ficha} ya existe`,
    );
  }

  async obtenerTodo() {
    return await this.gestorTModel.find();
  }

  async obtenerGestor(id_ficha: string): Promise<any> {
    return new Promise((resolve) => {
      resolve(
        this.gestorTModel.find({ ficha: id_ficha }).then((gestor) => {
          return gestor
            ? gestor
            : new NotFoundException(
                `No se encontró un gestor de tiempo para la ficha: ${id_ficha}`,
              );
        }),
      );
    });
  }
  async obtenerGestores(fichas): Promise<Gestor[] | []> {
    return await this.gestorTModel.find({ $or: fichas }).then((gestores) => {
      return gestores ? gestores : [];
    });
  }

  /**
   * Actualiza los tiempos de los resultados, las competencias y las fichas en el gestor de tiempo
   * @param registroEventos Recibe un objeto con los eventos a registrar en el gestor de tiempo
   * @returns Retorna un array con los resultados de la actualización de los gestores de tiempo
   */
  async actualizarTiempos(registroEventos): Promise<any> {
    const response = await Promise.all(
      registroEventos.eventos.map(async (evento) => {
        const comp = await this.gestorTModel.findOne({
          'competencias.codigo': evento.competencia.codigo,
        });

        let indexR = 0;
        comp.competencias.forEach((element) => {
          element.resultados.forEach((res, index) => {
            if (res.descripcion === evento.resultado.resultado) {
              indexR = index;
            }
          });
        });

        return await this.gestorTModel
          .findOneAndUpdate(
            {
              ficha: evento.ficha.ficha,
            },
            {
              $inc: {
                acumulado: evento.horas,
                'competencias.$[c].acumulado': evento.horas,
                [`competencias.$[c].resultados.${indexR}.acumulado`]:
                  evento.horas,
              },
            },
            {
              arrayFilters: [
                {
                  'c.codigo': evento.competencia.codigo,
                },
              ],
            },
          )
          .then(() => {
            return {
              actualizado: true,
              indexEvento: evento.index,
              competencia: evento.competencia.competencia,
              ordenResultado: evento.resultado.orden,
              horasAgregadas: evento.horas,
              motivo: `Gestor de tiempo de la ficha: ${evento.ficha.codigo} actualizado`,
            };
          })
          .catch((err) => {
            return {
              actualizado: false,
              indexEvento: evento.index,
              competencia: evento.competencia.competencia,
              ordenResultado: evento.resultado.orden,
              horasAgregadas: evento.horas,
              motivo: `Gestor de tiempo de la ficha: ${evento.ficha.codigo} actualizado`,
              error: err,
            };
          });
      }),
    );

    return response;
  }

  async existeGestor(id_ficha: string): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(
        this.gestorTModel.find({ ficha: id_ficha }).then((gestor) => {
          return gestor == null ? false : gestor.length == 0 ? false : true;
        }),
      );
    });
  }

  /**
   * Retrieves all the gestors associated with the given ficha.
   * @param ficha An array of ficha objects to search for.
   * @returns A Promise that resolves to an array of gestor objects.
   */
  async obtenerGestoresPorFicha(ficha: any[]): Promise<any> {
    return await this.gestorTModel.find({ $or: ficha }).exec();
  }

  /**
   * Resta el tiempo indicado en horas a un resultado de aprendizaje de una competencia de un gestor de tiempo de una ficha.
   * @param restarTiempoFichaDto Objeto DTO con la información necesaria para restar el tiempo a la ficha.
   * @returns Retorna un booleano indicando si la operación fue exitosa o no.
   */
  async restarTiempoFicha(
    restarTiempoFichaDto: RestarTiempoFichaDto,
  ): Promise<boolean> {
    const gestor = await this.obtenerGestor(restarTiempoFichaDto.ficha.ficha);

    if (gestor.length == 1) {
      const competenciasGestor = gestor[0].competencias;
      //Si el gestor tiene competencias
      if (competenciasGestor.length > 0) {
        const compIndex = competenciasGestor.findIndex(
          (competencia: any) =>
            competencia.codigo == restarTiempoFichaDto.competencia.codigo,
        );
        if (compIndex != -1) {
          const resuIndex = competenciasGestor[compIndex].resultados.findIndex(
            (resultado: any) =>
              resultado.orden == restarTiempoFichaDto.resultado.orden,
          );
          if (resuIndex != -1) {
            //Valido que el tiempo acumulado menos el que voy a restar no dé resultado negativo
            if (
              competenciasGestor[compIndex].resultados[resuIndex].acumulado -
                restarTiempoFichaDto.horas >=
              0
            ) {
              //Resto las horas al acumulado del resultado de aprendizaje
              competenciasGestor[compIndex].resultados[resuIndex].acumulado -=
                restarTiempoFichaDto.horas;
              //Resto las horas al acumulado de la competencia
              competenciasGestor[compIndex].acumulado -=
                restarTiempoFichaDto.horas;

              //Armo el objeto para actualizar los tiempos de la ficha en el gestor de tiempoCompetencia
              const actualizarTiempoFicha = {
                acumulado: gestor[0].acumulado - restarTiempoFichaDto.horas, //Acumulado de la ficha
                competencias: competenciasGestor,
              };

              return await this.gestorTModel
                .findOneAndUpdate(
                  { ficha: restarTiempoFichaDto.ficha.ficha },
                  actualizarTiempoFicha,
                )
                .then((gestor) => {
                  return gestor ? true : false;
                });
            }
          }
        }
      }
    }
    return false;
  }
}
