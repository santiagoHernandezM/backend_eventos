import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as excelToJson from 'convert-excel-to-json';
import { competenciaDto } from '../competencia/dto/competencia.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Competencia } from '../competencia/schema/competencia.schema';
import { Model } from 'mongoose';
import { ProgramaDto } from 'src/programa/dto/programa.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { ContratoDto } from 'src/users/dto/contrato.dto';
import { Programa } from 'src/programa/schema/programa.schema';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import * as moment from 'moment';
import { User } from 'src/users/schema/user.schema';
import { Ficha } from 'src/ficha/schema/ficha.schema';
import { CentroService } from 'src/centro/centro.service';
import { SedesService } from 'src/sedes/sedes.service';
import { AmbienteService } from 'src/ambiente/ambiente.service';
import { FichaService } from 'src/ficha/ficha.service';
import { CrearJornadaDto } from 'src/jornada/dto/jornada.dto';

@Injectable()
export class CargueMasivoCompetenciasService {
  constructor(
    @InjectModel(Competencia.name) private competenciaModel: Model<Competencia>,
    @InjectModel(Programa.name) private programaModel: Model<Programa>,
    private readonly usersService: UsersService,
    private readonly centroService: CentroService,
    private readonly sedesService: SedesService,
    private readonly ambienteService: AmbienteService,
    private readonly fichaService: FichaService,
  ) {}

  async processCsv(
    file: Express.Multer.File,
    programa: string,
  ): Promise<string> {
    const excelJson = await excelToJson({
      sourceFile: file.path,
    });
    const hojasExcel = Object.keys(excelJson); //Obtener keys de las hojas del excel

    const obj = {
      programa: programa,
      competencias: [],
    };
    //Recorremos hoja por hoja el excel
    for await (const hoja of hojasExcel) {
      //Recorremos las filas de la hoja
      for await (const competencia of excelJson[hoja]) {
        const compe = {
          codigo: competencia['A'], //Código de la competencia en la Columna A del excel
          nombre: competencia['B'], //Nombre de la competencia en la Columna B del excel
          duracion: parseInt(competencia['C']),
          resultados: [],
        };

        //Key de la competencia(Fila del excel)
        const columnas = Object.keys(competencia);
        for (let x = 3; x < columnas.length; x += 3) {
          if (competencia[columnas[x]] != '') {
            const pq = {
              descripcion: competencia[columnas[x]],
              orden: competencia[columnas[x + 1]],
              duracion: parseInt(competencia[columnas[x + 2]]),
            };
            compe.resultados.push(JSON.parse(JSON.stringify(pq)));
          } else break;
        }
        obj.competencias.push(JSON.parse(JSON.stringify(compe)));
      }
    }
    fs.unlinkSync(file.path);
    this.crearCompetencia(obj);
    return 'ok';
  }

  async processProgramas(file: Express.Multer.File): Promise<string> {
    const excelJson = await excelToJson({
      sourceFile: file.path,
    });
    const hojasExcel = Object.keys(excelJson);

    for await (const hoja of hojasExcel) {
      //Recorremos las filas de la hoja
      for await (const columna of excelJson[hoja]) {
        const paquete = {
          codigo: columna['A'], //Código de la competencia en la Columna A del excel
          nombre: columna['B'], //Nombre de la competencia en la Columna B del excel
          nivel: columna['C'],
          version: columna['D'],
          duracion: columna['E'],
          intensidad_horaria: columna['F'],
        };
        this.crearPrograma(paquete);
      }
    }
    fs.unlinkSync(file.path);
    return 'ok';
  }

  async processInstructor(
    file: Express.Multer.File,
    centro: string,
  ): Promise<any> {
    const excelJson = await excelToJson({
      sourceFile: file.path,
    });
    const hojasExcel = Object.keys(excelJson); //Obtener keys de las hojas del excel
    const nuevosInstructores: any[] = [];

    //Recorremos hoja por hoja el excel
    for await (const hoja of hojasExcel) {
      //Recorremos las filas de la hoja
      for await (const columna of excelJson[hoja]) {
        const f1 = columna['G'];
        const f2 = columna['H'];
        const tf1 = JSON.stringify(f1).split('T');
        const fe1 = tf1[0].substring(1, tf1[0].length);
        const tf2 = JSON.stringify(f2).split('T');
        const fe2 = tf2[0].substring(1, tf1[0].length);

        const instructor = {
          documento: columna['A'], //Código de la competencia en la Columna A del excel
          nombre: columna['B'], //Nombre de la competencia en la Co password:
          apellido: columna['C'],
          correo: columna['D'],
          celular: columna['E'],
          password: columna['A'].toString(),
          centro: centro,
          contrato: {
            numero: columna['F'],
            fechaInicio: fe1,
            fechaTerminacion: fe2,
            tipoVinculacion: columna['I'],
          },
          roles: ['Instructor'],
          programas: [],
        };

        const nuevoInstructor = await this.usersService.crearUser(instructor);
        if (nuevoInstructor) {
          nuevosInstructores.push(nuevoInstructor);
        }
      }
    }
    fs.unlinkSync(file.path);
    return nuevosInstructores;
  }

  async crearCompetencia(competencia: competenciaDto): Promise<Competencia> {
    const newCompetencia = new this.competenciaModel(competencia);
    return await newCompetencia.save();
  }

  async crearPrograma(programa: ProgramaDto): Promise<Programa> {
    const newPrograma = new this.programaModel(programa);
    return await newPrograma.save();
  }

  async processFichas(fichas: Express.Multer.File) {
    const fichasJson = await excelToJson({
      sourceFile: fichas.path,
      header: {
        rows: 1, //Omitimos la primera fila que es de los titulos de las columnas
      },
    });
    const datosExcel: any[] = Object.values(fichasJson);
    //Validamos que solo sea una hoja en el excel
    const resp = {
      error: false,
      messages: [],
      ex: null,
      fichas_creadas: 0,
      fichas_no_creadas: 0,
      dev: [],
    };
    if (datosExcel.length > 0) {
      let fichasCrear = [],
        instRelacionar = [],
        progRelacionar = [],
        centroByMunicipio = [];

      datosExcel.forEach((hoja: any[]) => {
        fichasCrear = hoja.flatMap((ficha) => ficha['A'].toString());
        instRelacionar = hoja.flatMap((ficha) => ficha['F'].toString());
        progRelacionar = hoja.flatMap((ficha) => ficha['G'].toString());
        centroByMunicipio = hoja.flatMap((ficha) => ficha['J']);
      });

      //Eliminar datos repetidos
      fichasCrear = Array.from(new Set(fichasCrear));
      instRelacionar = Array.from(new Set(instRelacionar));
      progRelacionar = Array.from(new Set(progRelacionar));
      centroByMunicipio = Array.from(new Set(centroByMunicipio));

      //Validar que todos los códigos de ficha, instructores y programas existan en la base de datos
      const fichasExistentes =
        await this.fichaService.getFichasByCodigos(fichasCrear);
      const instructoresExistentes =
        await this.usersService.getInstructoresByDocumento(instRelacionar);
      const programasExistentes = await this.programaModel.find({
        codigo: { $in: progRelacionar },
      });
      const centrosExistentes =
        await this.centroService.getCentrosByMunicipio(centroByMunicipio);

      if (instructoresExistentes.length > 0) {
        if (programasExistentes.length > 0) {
          if (centrosExistentes.length > 0) {
            const centrosId = centrosExistentes.flatMap((centro) => centro.id);
            const sedes = await this.sedesService.getSedesPorCentros(centrosId);
            if (sedes.length > 0) {
              const sedesId = sedes.flatMap((sede) => sede.id);
              const ambientes =
                await this.ambienteService.getAmbientesBySedes(sedesId);
              if (ambientes.length > 0) {
                /*
                 * Filas del excel
                 * A: Código ficha
                 * B: Tipo de programa
                 * C: Fecha inicio
                 * D: Fecha fin
                 * E: Nombre lider de ficha
                 * F: Documento lider ficha
                 * G: Código programa
                 * H: Version programa
                 * I: Nombre Programa de formación
                 * J: Municipio para escoger sede de la ejecución de la ficha
                 * K: Dias de formación, formato DIA horainicio horafin, DIA horainicio horafin...
                 * El Ambiente de ejecución(se coloca uno por defecto para la sede escogida)
                 */
                for (let i = 0; i < datosExcel.length; i++) {
                  const hoja = datosExcel[i];
                  for (let j = 0; j < hoja.length; j++) {
                    const existeFicha = fichasExistentes.some(
                      (ficha) => ficha.codigo === hoja[j]['A'].toString(),
                    );
                    if (!existeFicha) {
                      const instructor = instructoresExistentes.find(
                        (inst) => inst.documento === hoja[j]['F'].toString(),
                      );
                      if (instructor != undefined) {
                        const programa = programasExistentes.find(
                          (prog) => prog.codigo === hoja[j]['G'].toString(),
                        );
                        if (programa != undefined) {
                          const centroFicha = centrosExistentes.find(
                            (centro) => centro.municipio == hoja[j]['J'],
                          );
                          if (centroFicha) {
                            const sedesCentro = sedes.filter(
                              (sede) =>
                                sede.centro.toString() == centroFicha.id,
                            );
                            if (sedesCentro.length > 0) {
                              //Escojo por defecto la primera sede para crear la ficha

                              const sedeFicha = sedesCentro[0];
                              const ambientesSede = ambientes.filter(
                                (ambiente) =>
                                  ambiente.sede.toString() == sedeFicha.id,
                              );
                              if (ambientesSede.length > 0) {
                                let indexAmbiente = 0;
                                if (ambientesSede.length > 1) {
                                  indexAmbiente = Math.floor(
                                    Math.random() * ambientesSede.length,
                                  );
                                }
                                //Armar jornada
                                const jornadas = [];
                                const dias = hoja[j]['K'].split(',');
                                let error_dias = false;
                                for (let k = 0; k < dias.length; k++) {
                                  let splitDia = dias[k].split(' ');
                                  if (splitDia.length >= 3) {
                                    //Puede que tenga espacios en blanco
                                    //Eliminamos los espacios en blanco o item sin nada
                                    splitDia = splitDia.filter(
                                      (item: string) => item.trim() !== '',
                                    );
                                    if (splitDia.length == 3) {
                                      let dia = splitDia[0];
                                      switch (dia) {
                                        case 'MIERCOLES':
                                          dia = 'MIÉRCOLES';
                                          break;

                                        case 'SABADO':
                                          dia = 'SÁBADO';
                                          break;
                                      }
                                      const horainicio = splitDia[1];
                                      const horafin = splitDia[2];
                                      //Validar formato horas
                                      const solo_horainicio = parseInt(
                                        horainicio.split(':')[0],
                                      );

                                      let solo_horafin_min = horafin.split(':');
                                      solo_horafin_min[0] = parseInt(
                                        solo_horafin_min[0],
                                      );
                                      if (parseInt(solo_horafin_min[1]) == 59) {
                                        solo_horafin_min[0]++; //Aumentamos 1 hora más
                                        solo_horafin_min[1] = '00';
                                      }
                                      let jornada = 'Mañana';
                                      const horainicio_horafin = `${solo_horainicio}-${solo_horafin_min[0]}`;
                                      if (
                                        horainicio_horafin == '12-18' ||
                                        horainicio_horafin == '12-20'
                                      ) {
                                        jornada = 'Tarde';
                                      } else if (
                                        horainicio_horafin == '20-22' ||
                                        horainicio_horafin == '18-22'
                                      ) {
                                        jornada = 'Noche';
                                      } else if (
                                        horainicio_horafin == '6-20' ||
                                        horainicio_horafin == '6-22' ||
                                        horainicio_horafin == '8-20' ||
                                        horainicio_horafin == '8-22' ||
                                        horainicio_horafin == '12-20' ||
                                        horainicio_horafin == '12-22' ||
                                        horainicio_horafin == '14-20' ||
                                        horainicio_horafin == '14-22'
                                      ) {
                                        jornada = 'Mixta';
                                      }
                                      jornadas.push({
                                        dia,
                                        jornada,
                                        horaInicio: solo_horainicio.toString(),
                                        horaFin: solo_horafin_min[0].toString(),
                                      });
                                    } else {
                                      error_dias = true;
                                      break;
                                    }
                                  } else {
                                    error_dias = true;
                                    break;
                                  }
                                }
                                if (!error_dias) {
                                  /*
                                   * La fecha es invalida cuándo viene en el formato dia/mes/año toca hacerla año/mes/dia
                                   */
                                  let fechaInicio = hoja[j]['C'].split('/');
                                  fechaInicio = `${fechaInicio[2]}/${fechaInicio[1]}/${fechaInicio[0]}`;
                                  let fechaFin = hoja[j]['D'].split('/');
                                  fechaFin = `${fechaFin[2]}/${fechaFin[1]}/${fechaFin[0]}`;
                                  await this.fichaService
                                    .crearFicha({
                                      ambiente: ambientesSede[indexAmbiente].id,
                                      codigo: hoja[j]['A'].toString(),
                                      fechaInicio,
                                      fechaFin,
                                      instructor: instructor.id,
                                      programa: programa.id,
                                      sede: sedeFicha.id,
                                      jornadas,
                                    })
                                    .then((r) => {
                                      if (r != null) {
                                        resp.fichas_creadas++;
                                      } else {
                                        resp.messages.push(
                                          `No se pudo crear la ficha ${hoja[j]['A']}`,
                                        );
                                        resp.fichas_no_creadas++;
                                        resp.error = true;
                                      }
                                    })
                                    .catch((error) => {
                                      resp.messages.push(
                                        `Sucedió un error creando la ficha ${hoja[j]['A']}, error: ${error}`,
                                      );
                                      resp.fichas_no_creadas++;
                                      resp.error = true;
                                    });
                                } else {
                                  resp.error = true;
                                  resp.messages.push(
                                    `Formato de DIAS de formación incorrecto para la ficha ${hoja[j]['A']}`,
                                  );
                                }
                              } else {
                                resp.error = true;
                                resp.messages.push(
                                  `No hay ambientes para la sede ${sedeFicha.nombre} para crear la ficha ${hoja[j]['A']}`,
                                );
                              }
                            } else {
                              resp.error = true;
                              resp.messages.push(
                                `No existe una sede para el centro: ${centroFicha.id} para crear la ficha ${hoja[j]['A']}`,
                              );
                              continue;
                            }
                          } else {
                            resp.error = true;
                            resp.messages.push(
                              `No existe un centro para el municipio: ${hoja[j]['J']} para crear la ficha ${hoja[j]['A']}`,
                            );
                          }
                        } else {
                          resp.error = true;
                          resp.messages.push(
                            `No existe el programa ${hoja[j]['I']} con código: ${hoja[j]['G']}`,
                          );
                        }
                      } else {
                        resp.error = true;
                        resp.messages.push(
                          `No existe el instructor ${hoja[j]['E']} con documento: ${hoja[j]['F']}`,
                        );
                      }
                    } else {
                      resp.error = true;
                      resp.messages.push(
                        `Ya existe la ficha con código: ${hoja[j]['A']}`,
                      );
                    }
                  }
                }
              } else {
                resp.error = true;
                resp.messages.push(
                  'No se encontraron ambientes asociados a las sedes seleccionadas',
                );
              }
            } else {
              resp.error = true;
              resp.messages.push(
                'No se encontraron sedes asociadas a los centros seleccionados',
              );
            }
          } else {
            resp.error = true;
            resp.messages.push(
              `No existen Centros para los municipios: ${centroByMunicipio.join(
                ', ',
              )}`,
            );
          }
        } else {
          resp.error = true;
          resp.messages.push(
            `No existen los programas con código: ${progRelacionar.join(', ')}`,
          );
        }
      } else {
        resp.error = true;
        resp.messages.push(
          `No existen los instructores con documento: ${instRelacionar.join(
            ', ',
          )}`,
        );
      }
    } else {
      resp.error = true;
      resp.messages.push('El excel debe contener solo una hoja');
    }

    fs.unlinkSync(fichas.path);
    return resp;
  }
}
