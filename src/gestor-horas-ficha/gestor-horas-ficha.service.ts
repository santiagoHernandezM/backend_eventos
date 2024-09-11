import { Injectable } from '@nestjs/common';
import { UpdateGestorHorasFichaDto } from './dto/update-gestor-horas-ficha.dto';
import { InjectModel } from '@nestjs/mongoose';
import { GestorHorasFicha } from './schema/gestor-horas-ficha.schema';
import * as moment from 'moment-timezone';
import { Model } from 'mongoose';
import { ReporteHorasDto, RestarHorasFichaDto } from './dto/reporteHoras.dto';
import { User } from 'src/users/schema/user.schema';
import { Programa } from 'src/programa/schema/programa.schema';
import { Ficha } from 'src/ficha/schema/ficha.schema';

@Injectable()
export class GestorHorasFichaService {
  constructor(
    @InjectModel(GestorHorasFicha.name)
    private gestorHorasFichaModel: Model<GestorHorasFicha>,
    @InjectModel(User.name) private usuarioModel: Model<User>,
    @InjectModel(Ficha.name) private fichaModel: Model<Ficha>,
  ) {}

  /**
   *
   * @param codigo_ficha {string} codigo de la ficha creada
   * @param year_inicio_ficha {number} Año de inicio de la Ficha
   * @returns {string} Mensaje de la creación del gestor de horas de la ficha
   */
  async crearGestorHorasFicha(
    codigo_ficha: string,
    year_inicio_ficha: number,
  ): Promise<string> {
    const now = moment().tz('America/Bogota');
    const existGestor = await this.gestorHorasFichaModel.findOne({
      codigo_ficha,
      year: year_inicio_ficha,
    });
    if (existGestor == null) {
      return await this.gestorHorasFichaModel
        .create({ codigo_ficha, year: year_inicio_ficha })
        .then((gestor) => {
          return gestor != null
            ? 'Gestor creado correctamente'
            : 'No se pudo crear el gestor';
        })
        .catch((error) => {
          return 'Sucedió un problema creando el gestor';
        });
    }
    return 'Ya existe un gestor de horas para esta ficha';
  }

  findAll() {
    return `This action returns all gestorHorasFicha`;
  }

  async getGestorFichasPorPrograma(programa: string) {
    const fichasPrograma = await this.fichaModel.find({ programa });
    const codFichas = fichasPrograma.flatMap((ficha) => ficha.codigo);
    return await this.gestorHorasFichaModel.find({
      codigo_ficha: { $in: codFichas },
    });
  }

  async findOne(ficha: string) {
    const now = moment().tz('America/Bogota');
    return await this.gestorHorasFichaModel.findOne({
      codigo_ficha: ficha,
      year: now.year(),
    });
  }

  async actualizarHorasInstructor(reporteHoras: ReporteHorasDto) {
    const instructor = await this.usuarioModel.findOne({
      _id: reporteHoras.id_instructor,
    });
    if (instructor) {
      const codigosFicha = reporteHoras.reporte.flatMap((r) => r.codigo_ficha);
      //['123', '2814', '23']
      const gestores = await this.gestorHorasFichaModel.find({
        codigo_ficha: { $in: codigosFicha },
      });
      if (gestores.length > 0) {
        reporteHoras.reporte.forEach(async (reporte) => {
          //Buscamos el index del gestor
          const indexGestor = gestores.findIndex(
            (gestor) => gestor.codigo_ficha == reporte.codigo_ficha,
          );
          if (indexGestor > -1) {
            reporte.meses.forEach((reporteMes) => {
              //Verificamos si el mes está creado
              const indexMes = gestores[indexGestor].meses.findIndex(
                (mes) => mes.mes == reporteMes.mes,
              );
              if (indexMes > -1) {
                //Verificamos si el instructor está creado
                const indexInstructor = gestores[indexGestor].meses[
                  indexMes
                ].instructores.findIndex(
                  (inst) => inst.documento == instructor.documento,
                );
                if (indexInstructor > -1) {
                  gestores[indexGestor].meses[indexMes].instructores[
                    indexInstructor
                  ].horas += reporteMes.horas;
                } else {
                  //No existe el instructor, toca crearlo instructor
                  gestores[indexGestor].meses[indexMes].instructores.push({
                    documento: instructor.documento,
                    nombre: instructor.nombre,
                    apellido: instructor.apellido,
                    horas: reporteMes.horas,
                    tipoVinculacion: instructor.contrato.tipoVinculacion,
                  });
                }
              } else {
                //No existe el mes, toca crearlo
                gestores[indexGestor].meses.push({
                  mes: reporteMes.mes,
                  instructores: [
                    {
                      documento: instructor.documento,
                      nombre: instructor.nombre,
                      apellido: instructor.apellido,
                      horas: reporteMes.horas,
                      tipoVinculacion: instructor.contrato.tipoVinculacion,
                    },
                  ],
                });
              }
            });
          }
        });
        //Actualizamos los gestores
        for await (const gestor of gestores) {
          await this.gestorHorasFichaModel.findOneAndUpdate(
            { codigo_ficha: gestor.codigo_ficha },
            gestor,
          );
        }
        return 'Horas actualizadas correctamente';
      }
      return 'No se encontraron los gestores de las fichas';
    }
    return 'El instructor no existe';
  }

  async restarHorasInstructorFicha(restarHoras: RestarHorasFichaDto) {
    //Para obtener el documento del instructor hay que consultar en user
    const instructor = await this.usuarioModel.findOne({
      _id: restarHoras.id_instructor,
    });
    if (instructor) {
      const gestor = await this.gestorHorasFichaModel.findOne({
        codigo_ficha: restarHoras.codigo_ficha,
        year: restarHoras.year,
      });
      if (gestor) {
        const indexMes = gestor.meses.findIndex(
          (m) => m.mes === restarHoras.mes,
        );
        if (indexMes > -1) {
          const indexInstructor = gestor.meses[indexMes].instructores.findIndex(
            (inst) => inst.documento === instructor.documento,
          );
          if (indexInstructor > -1) {
            if (
              restarHoras.horas <=
              gestor.meses[indexMes].instructores[indexInstructor].horas
            ) {
              gestor.meses[indexMes].instructores[indexInstructor].horas -=
                restarHoras.horas;
              return await this.gestorHorasFichaModel.findOneAndUpdate(
                { _id: gestor._id },
                { meses: gestor.meses },
              );
            }
            return 'No se pueden restar horas superiores a las que tienes';
          }
          return 'El instructor no existe en el gestor de horas para la ficha';
        }
        return 'El mes no existe en el gestor de horas para la ficha';
      }
      return 'El gestor de horas para ficha no existe';
    }
    return 'El instructor no existe';
  }

  update(id: number, updateGestorHorasFichaDto: UpdateGestorHorasFichaDto) {
    return `This action updates a #${id} gestorHorasFicha`;
  }

  remove(id: number) {
    return `This action removes a #${id} gestorHorasFicha`;
  }
}
