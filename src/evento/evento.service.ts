import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Evento } from './schema/evento.schema';
import { eventoDto } from './dto/evento.dto';
import { GestorTService } from 'src/gestor-t/gestor-t.service';
import {
  eliminarEventoDto,
  eliminarEventoEspecificoDto,
} from './dto/eliminarEvento.dto';
import { GestorAmbienteService } from 'src/gestor-ambiente/gestor-ambiente.service';
import { GestorHorasFichaService } from 'src/gestor-horas-ficha/gestor-horas-ficha.service';

import * as moment from 'moment-timezone';
import { ReporteMesesDto } from 'src/gestor-horas-ficha/dto/reporteHoras.dto';

@Injectable()
export class EventoService {
  constructor(
    @InjectModel(Evento.name) private eventoModel: Model<Evento>,
    @Inject(GestorTService) private gestorTService: GestorTService,
    @Inject(GestorAmbienteService)
    private gestorAmbienteService: GestorAmbienteService,
    @Inject(GestorHorasFichaService)
    private gestorHorasFichaService: GestorHorasFichaService,
  ) {}

  async obtenerEventos(): Promise<Evento[]> {
    return this.eventoModel.find().exec();
  }

  async crearEvento(evento: eventoDto) {
    // * Obtenemos las condiciones de consulta para los eventos existentes

    const condicionesConsulta = evento.eventos.map((mes) => {
      return {
        mes: mes.mes,
        year: mes.year,
        'eventos.ambiente.ambiente': mes.ambiente.ambiente,
        'eventos.horario': mes.horario,
        'eventos.diastrabajados': { $in: mes.diastrabajados },
      };
    });
    // * Consulta de eventos existentes
    const eventosEncontrados = await this.eventoModel
      .find({ $or: condicionesConsulta })
      .exec();

    if (eventosEncontrados.length > 0) {
      const mensajeConflict = [];
      eventosEncontrados.map((eventoInstructor) => {
        eventoInstructor.eventos.map((eventoReportado) => {
          evento.eventos.map((eventosAReportar) => {
            let diaConnflicto = [];
            let repiteDia: boolean;
            eventoReportado.diastrabajados.map((diaEspecifico) => {
              if (eventosAReportar.diastrabajados.includes(diaEspecifico)) {
                repiteDia = true;
                diaConnflicto.push(diaEspecifico);
              }
            });
            if (
              eventosAReportar.ambiente.ambiente ==
                eventoReportado.ambiente.ambiente &&
              eventosAReportar.horario == eventoReportado.horario &&
              repiteDia
            ) {
              mensajeConflict.push({
                evento: eventoReportado,
                mensaje: `Ya existe un evento en el ambiente ${
                  eventoReportado.ambiente.ambiente
                } con horario ${
                  eventoReportado.horario
                } para los días ${diaConnflicto.join(', ')} del mes ${
                  eventosAReportar.mes
                } de ${eventosAReportar.year}`,
              });
            }
          });
        });
      });
      if (mensajeConflict.length > 0) {
        throw new ConflictException(mensajeConflict);
      }
    }

    /**
     * Valida los tiempos que se piensan agregar al gestor de tiempo
     * y retorna un error en la respuesta en caso de encontrar
     * alguno.
     */

    await this.validarTiempos(evento);

    /**
     * LLamada a los servicios que actualizan los gestores
     */
    const respGestor = await this.gestorTService.actualizarTiempos(evento);

    //  Actualizar El ambiente
    await this.gestorAmbienteService.actualizarAmbiente(
      evento.eventos,
      evento.instructor,
    );

    //Actualizar el gestor de la ficha
    //['2684','2684','123']
    let codigos = evento.eventos.flatMap((evento) => evento.ficha.codigo);
    codigos = [...new Set(codigos)];
    //[{codigo_ficha, meses:[{mes:1, horas:2}]}]
    const reporteFichas: ReporteMesesDto[] = [];
    codigos.forEach((cod) => {
      const indexReporte = reporteFichas.findIndex(
        (r) => r.codigo_ficha == cod,
      );
      //No se ha guardado el reporte de horas para la ficha
      if (indexReporte == -1) {
        const eventosCod = evento.eventos.filter(
          (ev) => ev.ficha.codigo == cod,
        );
        if (eventosCod.length > 0) {
          //{codigo_ficha, meses[]{mes:1, horas: 12}}
          const repor: ReporteMesesDto = { codigo_ficha: cod, meses: [] };
          eventosCod.forEach((ev) => {
            const indexMes = repor.meses.findIndex((mes) => mes.mes == ev.mes);
            indexMes == -1
              ? repor.meses.push({ mes: ev.mes, horas: ev.horas })
              : (repor.meses[indexMes].horas += ev.horas);
          });
          reporteFichas.push(repor);
        }
      }
    });

    /* {
      reporte: [{ codigo_ficha: 123, meses: [{ mes: 1, horas: 120 }] }];
      year: 2022;
      id_instructor: '2684';
    } */
    const now = moment().tz('America/Bogota');
    await this.gestorHorasFichaService.actualizarHorasInstructor({
      reporte: reporteFichas,
      year: now.year(),
      id_instructor: evento.instructor,
    });

    const busquedaInstructor = evento.eventos.map((ev) => ({
      mes: ev.mes,
      year: ev.year,
      instructor: evento.instructor,
    }));
    const registrosEventoExistente = await this.eventoModel.find({
      $or: busquedaInstructor,
    });

    const eventosCrear = [];
    if (registrosEventoExistente.length === 0) {
      //[{mes:1, year:2002, instructor:12h2h1v223tsvhg347hb, eventos:[] }]

      evento.eventos.forEach((ev) => {
        const indexMes = eventosCrear.findIndex((e) => e.mes == ev.mes);
        const copia_e = { ...ev };
        delete copia_e.mes;
        delete copia_e.year;
        indexMes > -1
          ? eventosCrear[indexMes].eventos.push(copia_e)
          : eventosCrear.push({
              mes: ev.mes,
              year: ev.year,
              instructor: evento.instructor,
              eventos: [copia_e],
            });
      });
    } else {
      //Hay un evento que ya tiene documento, pero puede que hayan eventos que no tengan documentos creados
      //Filtro para guardar donde corresponda
      evento.eventos.forEach((ev) => {
        const indexEvento = registrosEventoExistente.findIndex(
          (reg) => reg.mes == ev.mes && reg.year == ev.year,
        );
        const copia_e = { ...ev };
        delete copia_e.mes;
        delete copia_e.year;
        //Existe, toca actualizar
        if (indexEvento > -1) {
          registrosEventoExistente[indexEvento].eventos.push(copia_e);
        } else {
          const indexEventoCrear = eventosCrear.findIndex(
            (ev_crear) => ev_crear.mes == ev.mes && ev_crear.year == ev.year,
          );
          indexEventoCrear > -1
            ? eventosCrear[indexEventoCrear].eventos.push(copia_e)
            : eventosCrear.push({
                mes: ev.mes,
                year: ev.year,
                instructor: evento.instructor,
                eventos: [copia_e],
              });
        }
      });
    }
    //Colecciones a crear
    if (eventosCrear.length > 0) {
      await this.eventoModel.insertMany(eventosCrear);
    }

    //Colecciones a actualizar
    if (registrosEventoExistente.length > 0) {
      for await (const ev of registrosEventoExistente) {
        await this.eventoModel.findByIdAndUpdate(ev._id, ev).exec();
      }
    }
    return {
      isUpdated: registrosEventoExistente.length > 0,
      statusCode: HttpStatus.OK,
      message: {
        eventos_update: registrosEventoExistente,
        eventos_create: eventosCrear,
      },
      messageGestor: respGestor,
    };
  }

  async obtenerEventosPorFecha(
    mes: number,
    year: number,
    ambiente: string,
    horario: string,
  ): Promise<boolean> {
    const evento = await this.eventoModel
      .find({
        mes: mes,
        year: year,
        'eventos.ambiente.ambiente': ambiente,
        'eventos.horario': horario,
      })
      .exec();

    return evento.length > 0 ? true : false;
  }

  /**
   * Obtener los eventos de un instructor en especifico filtrando por
   * mes y año para mostrarlos en la vista de Eventos
   *
   * @param mes Mes de los eventos a consultar
   * @param year Año de los eventos a consultar
   * @param instructor ObjectId del instructor al que se le consultaran los eventos
   * @returns Eventos de un instructor por mes y año
   */
  async obtenerEventosEspecificos(
    mes: number,
    year: number,
    instructor: string,
  ) {
    const eventos = await this.eventoModel.find({
      mes: mes,
      year: year,
      instructor: instructor,
    });

    if (eventos.length === 0) {
      throw new BadRequestException(
        `No se encontraron eventos para el instructor ${instructor} en el mes ${mes} del año ${year}`,
      );
    }

    return eventos;
  }

  /**
   * Valida los tiempos acumulados de los Resultados de aprendizaje,
   * las Competencias y la Ficha de los eventos que se están intentando
   * registrar haciendo uso del campo "horas" de los eventos enviados.
   *
   * @param payload Registro de evento que se quiere guardar en la base de datos
   * @returns true en caso de pasar las validaciones
   */
  async validarTiempos(payload: eventoDto) {
    const idFichas = payload.eventos.map((evento) => {
      return {
        ficha: evento.ficha.ficha,
      };
    });

    const gestores =
      await this.gestorTService.obtenerGestoresPorFicha(idFichas);

    // validación de tiempo para los resultados
    const tiempoResultado = idFichas.map((ficha, index) => {
      const validaciones = gestores.map((gestor) => {
        const idFichaEnvio = ficha.ficha;
        const idFichaGestor = JSON.stringify(gestor.ficha).replace(
          /['"]+/g,
          '',
        );

        if (idFichaEnvio === idFichaGestor) {
          // payload.eventos[index].horas == gestor.tiempo;
          const indiceCompetencia = gestor.competencias.findIndex(
            (competencia) =>
              competencia.codigo === payload.eventos[index].competencia.codigo,
          );

          const indiceResultado = gestor.competencias[
            indiceCompetencia
          ].resultados.findIndex(
            (resultado) =>
              resultado.descripcion ===
              payload.eventos[index].resultado.resultado,
          );

          const duracion =
            gestor.competencias[indiceCompetencia].resultados[indiceResultado]
              .duracion;

          const acumulado =
            gestor.competencias[indiceCompetencia].resultados[indiceResultado]
              .acumulado;

          return acumulado + payload.eventos[index].horas <= duracion;
        }
      });

      return validaciones.toString() === 'false' ? false : true;
    });

    const resultadosConflictivos: object[] = [];
    tiempoResultado.forEach((resultado, index) => {
      if (!resultado) {
        resultadosConflictivos.push({
          evento: payload.eventos[index],
          mensaje: `La ficha ${payload.eventos[index].ficha.codigo} no tiene tiempo disponible para el resultado ${payload.eventos[index].resultado.resultado}`,
        });
      }
    });

    if (resultadosConflictivos.length > 0) {
      throw new ConflictException(resultadosConflictivos);
    }

    // validación de tiempo para las competencias
    const tiempoCompetencia = idFichas.map((ficha, index) => {
      // se suman las horas de envio para la misma ficha
      const sumaHorasEnvio = payload.eventos.reduce((acumulador, evento) => {
        if (evento.ficha.ficha === ficha.ficha) {
          return acumulador + evento.horas;
        }
      }, 0);

      const validaciones = gestores.map((gestor) => {
        const idFichaEnvio = ficha.ficha;
        const idFichaGestor = JSON.stringify(gestor.ficha).replace(
          /['"]+/g,
          '',
        );

        if (idFichaEnvio === idFichaGestor) {
          // payload.eventos[index].horas == gestor.tiempo;
          const indiceCompetencia = gestor.competencias.findIndex(
            (competencia) =>
              competencia.codigo === payload.eventos[index].competencia.codigo,
          );

          const duracion = gestor.competencias[indiceCompetencia].duracion;
          const acumulado = gestor.competencias[indiceCompetencia].acumulado;
          const validacionCompetencia = acumulado + sumaHorasEnvio <= duracion;

          return !validacionCompetencia ? false : true;
        }
      });
      return validaciones;
    });

    const competenciasConflictivas: object[] = [];
    tiempoCompetencia.forEach((competencia, index) => {
      if (!competencia) {
        competenciasConflictivas.push({
          evento: payload.eventos[index],
          mensaje: `La ficha ${payload.eventos[index].ficha.codigo} no tiene tiempo disponible para la competencia ${payload.eventos[index].competencia.codigo}`,
        });
      }
    });

    if (competenciasConflictivas.length > 0) {
      throw new ConflictException(competenciasConflictivas);
    }

    // validación de tiempo para las fichas
    const tiempoFicha = idFichas.map((ficha) => {
      // se suman las horas de envio para la misma ficha
      const sumaHorasEnvio = payload.eventos.reduce((acumulador, evento) => {
        if (evento.ficha.ficha === ficha.ficha) {
          return acumulador + evento.horas;
        }
      }, 0);

      const validaciones = gestores.map((gestor) => {
        const idFichaEnvio = ficha.ficha;
        const idFichaGestor = JSON.stringify(gestor.ficha).replace(
          /['"]+/g,
          '',
        );

        if (idFichaEnvio === idFichaGestor) {
          const duracion = gestor.duracion;
          const acumulado = gestor.acumulado;
          const validacionFicha = acumulado + sumaHorasEnvio <= duracion;

          return !validacionFicha ? false : true;
        }
      });
      return validaciones;
    });

    const fichasConflictivas: object[] = [];
    tiempoFicha.forEach((ficha, index) => {
      if (!ficha) {
        fichasConflictivas.push({
          evento: payload.eventos[index],
          mensaje: `La ficha ${payload.eventos[index].ficha.codigo} no tiene tiempo disponible`,
        });
      }
    });

    if (fichasConflictivas.length > 0) {
      throw new ConflictException(fichasConflictivas);
    }

    return true;
  }

  /**
   * Eliminar evento registrado en la base de datos
   *
   * @param eventoInfo Información del evento a eliminar
   * @returns Evento eliminado
   */
  async eliminarEvento(eventoInfo: eliminarEventoDto) {
    const evento = await this.eventoModel
      .find({
        mes: eventoInfo.mes,
        year: eventoInfo.year,
        'eventos.ambiente.ambiente': eventoInfo.ambiente,
        'eventos.horario': eventoInfo.horario,
        'eventos.diastrabajados': { $in: eventoInfo.diasTrabajados },
      })
      .exec();

    let fichaEvento = [],
      codigo_ficha: string;
    evento[0].eventos.forEach((event, index) => {
      if (
        event.diastrabajados.some((item) =>
          eventoInfo.diasTrabajados.includes(item),
        )
      ) {
        fichaEvento = evento[0].eventos.splice(index, 1);
        codigo_ficha = event.ficha.codigo;
      }
    });

    delete evento[0]._id;
    //Si se elimino un evento con splice
    if (fichaEvento.length == 1) {
      const gestorActualizar = {
        ficha: {
          ficha: fichaEvento[0].ficha.ficha,
        },
        horas: eventoInfo.horas,
        competencia: {
          codigo: fichaEvento[0].competencia.codigo,
        },
        resultado: {
          orden: fichaEvento[0].resultado.orden,
        },
      };
      //true si se resto bien sino false
      const tiempoFichaGestorActualizado =
        await this.gestorTService.restarTiempoFicha(gestorActualizar);
      await this.gestorHorasFichaService.restarHorasInstructorFicha({
        codigo_ficha: codigo_ficha,
        horas: eventoInfo.horas,
        id_instructor: eventoInfo.instructor,
        mes: eventoInfo.mes,
        year: eventoInfo.year,
      });
      return tiempoFichaGestorActualizado;
    }

    const eventoActualizado = await this.eventoModel
      .findByIdAndUpdate(evento[0]._id, evento[0])
      .exec();

    return eventoActualizado;
  }

  async eliminarEventoEspecifico(
    eventoEspecificoDto: eliminarEventoEspecificoDto,
  ) {
    const gestorTiempo = {
      ficha: {
        ficha: eventoEspecificoDto.evento.ficha.ficha,
      },
      horas: eventoEspecificoDto.evento.horas,
      competencia: {
        codigo: eventoEspecificoDto.evento.competencia.codigo,
      },
      resultado: {
        orden: eventoEspecificoDto.evento.resultado.orden,
      },
    };

    await this.gestorTService.restarTiempoFicha(gestorTiempo);

    await this.gestorAmbienteService.restarHorarioAmbiente(eventoEspecificoDto); // Aqui

    const evento = await this.eventoModel
      .findOne({
        mes: eventoEspecificoDto.mes,
        year: eventoEspecificoDto.year,
        instructor: eventoEspecificoDto.instructor,
      })
      .exec();
    const eventoEliminado = evento.eventos.splice(
      eventoEspecificoDto.eventIndex,
      1,
    )[0];

    await evento.save();
    await this.gestorHorasFichaService.restarHorasInstructorFicha({
      codigo_ficha: eventoEspecificoDto.evento.ficha.codigo,
      horas: eventoEspecificoDto.evento.horas,
      id_instructor: eventoEspecificoDto.instructor,
      mes: evento.mes,
      year: evento.year,
    });
    return eventoEliminado;
  }

  async reporteDeEvento(year: number, month: number) {
    const eventos = await this.eventoModel
      .find({
        mes: month,
        year: year,
      })
      .populate({
        path: 'instructor',
        populate: {
          path: 'programas',
        },
      });

    const response = eventos.map((evento) => {
      const mes = evento.mes;
      const documento = evento.instructor.documento;
      const nombre = evento.instructor.nombre;

      return evento.eventos.map((e) => {
        const horas = e.horario.split('-');
        const dias = e.diastrabajados.sort((a, b) => a - b).join('-');
        const dd = dias.split('-');
        const sesiones = e.diastrabajados.length;
        return {
          year: year,
          mes: mes,
          documentoInstructor: documento,
          nombreInstructor: nombre,
          numeroFicha: e.ficha.codigo,
          programa: e.programa.nombre,
          horaInicio: horas[0],
          horaFin: horas[1],
          fechaInicio: dd[0],
          fechaFin: dd[sesiones - 1],
          dia: e.dia,
          competencia: e.competencia.competencia,
          resultado: e.resultado.resultado,
          tipo: e.nivel,
          municipio: e.municipio,
          ambiente: e.ambiente.ambiente,
          totalSesiones: sesiones,
          horaSesion: e.horas / sesiones,
          totalHoras: e.horas,
          //dias: e.diastrabajados,
        };
      });
    });

    return response;
  }

  async getEventosByProgrmasMesAnio(
    mes: number,
    year: number,
    programaIds: string[],
  ): Promise<any[]> {
    const eventos = await this.eventoModel
      .find({ mes, year })
      .populate('instructor')
      .exec();
    const programas = [];
    eventos.forEach((evento) => {
      evento.eventos.forEach((e) => {
        if (programaIds.includes(e.programa.id)) {
          const horas = e.horario.split('-');
          const dias = e.diastrabajados.sort((a, b) => a - b).join('-');
          const dd = dias.split('-');
          const sesiones = e.diastrabajados.length;
          programas.push({
            year: year,
            mes: mes,
            documentoInstructor: evento.instructor.documento,
            nombreInstructor: evento.instructor.nombre,
            numeroFicha: e.ficha.codigo,
            programa: e.programa.nombre,
            horaInicio: horas[0],
            horaFin: horas[1],
            fechaInicio: dd[0],
            fechaFin: dd[sesiones - 1],
            dia: e.dia,
            competencia: e.competencia.competencia,
            resultado: e.resultado.resultado,
            tipo: e.nivel,
            municipio: e.municipio,
            ambiente: e.ambiente.ambiente,
            totalSesiones: sesiones,
            horaSesion: e.horas / sesiones,
            totalHoras: e.horas,
          });
        }
      });
    });
    return programas;
  }
}
