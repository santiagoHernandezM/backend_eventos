import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { GestorAmbiente } from './schema/gestor-ambiente.schema';
import { Model } from 'mongoose';
import { EventosModelDto } from 'src/evento/dto/eventos.dto';
import { eliminarEventoEspecificoDto } from 'src/evento/dto/eliminarEvento.dto';
import { SedesService } from 'src/sedes/sedes.service';
import {
  AgregarAmbienteGestorDto,
  CreateGestorAmbienteDto,
} from './dto/gestor-ambiente.dto';
import * as moment from 'moment-timezone';
import { Ambiente } from 'src/ambiente/schemas/ambiente.schema';
import { IAmbiente } from 'src/ambiente/interfaces/ambiente.interface';

@Injectable()
export class GestorAmbienteService {
  constructor(
    @InjectModel(GestorAmbiente.name)
    private gestorAmbienteModel: Model<GestorAmbiente>,
    @InjectModel(Ambiente.name) private ambienteModel: Model<Ambiente>,
    @Inject(SedesService) private sedesService: SedesService,
  ) {}

  async crearGestorActual(centro: string) {
    const calendarioEstatico = Array(31).fill({
      morning: null,
      afternoon: null,
      night: null,
    });
    var insertAmbientes = [];
    let sedes: any = await this.sedesService.sedesPorCentro(centro);
    sedes = sedes.map((sede: any) => {
      return sede.id;
    });

    const now = moment().tz('America/Bogota');

    // El uso de promise all es por que los Maps asincronicos anidados se comportan de manera indetermindas
    await Promise.all(
      sedes.map(async (sede: any) => {
        let AmbienteSedeEspecifico = {
          centro: centro,
          sede: sede,
          ambientes: [],
          year: now.year(),
        };
        const ambientesDeLaSede = await this.ambientesPorSede(sede);

        /*       ambientesDeLaSede.map((ambiente: any) => {
          let ambienteParaDisponibilidad = {
            id: ambiente.id,
            nombre: `${ambiente.bloque.nomenclatura}-${ambiente.codigo}`,
            calendario: calendarioEstatico,
          };
          AmbienteSedeEspecifico.ambientes.push(ambienteParaDisponibilidad);
        }); */

        // Usar Promise.all con map para hacer las operaciones asincrónicas
        await Promise.all(
          ambientesDeLaSede.map(async (ambiente: any) => {
            const ambienteParaDisponibilidad = {
              id: ambiente.id,
              nombre: `${ambiente.bloque.nomenclatura}-${ambiente.codigo}`,
              calendario: calendarioEstatico,
            };
            AmbienteSedeEspecifico.ambientes.push(ambienteParaDisponibilidad);
          }),
        );
        insertAmbientes.push(AmbienteSedeEspecifico);
      }),
    );
    return await this.gestorAmbienteModel.insertMany(insertAmbientes);
  }

  async agregarAmbienteGestor(ambiente: AgregarAmbienteGestorDto) {
    //Buscamos si existe el gestor para la sede
    const now = moment().tz('America/Bogota');
    const gestor = await this.gestorAmbienteModel.findOne({
      sede: ambiente.sede,
      year: now.year(),
    });

    const calendarioEstatico = Array(31).fill({
      morning: null,
      afternoon: null,
      night: null,
    });

    const newAmbiente: CreateGestorAmbienteDto = {
      id: ambiente.ambiente,
      nombre: ambiente.nomenclatura_codigo,
      calendario: calendarioEstatico,
    };

    if (gestor != null) {
      //Agregamos el ambiente al gestor
      return await this.gestorAmbienteModel.findByIdAndUpdate(gestor._id, {
        $push: {
          ambientes: newAmbiente,
        },
      });
    } else {
      //No existe el gestor, lo creamos
      //Buscamos la sede para coger el _id del centro
      const sede = await this.sedesService.getSede(ambiente.sede);
      return await this.gestorAmbienteModel.create({
        sede: ambiente.sede,
        centro: sede.centro,
        ambientes: [newAmbiente],
        year: now.year(),
      });
    }
  }

  async actualizarAmbiente(evento: EventosModelDto[], instructor: string) {
    let indexAmbiente: number;
    let horario: string;
    await Promise.all(
      evento.map(async (evento) => {
        const ambientesSedes: any = await this.gestorAmbienteModel.findOne({
          'ambientes.id': evento.ambiente.id,
        });
        ambientesSedes.ambientes.map((ambiente: any, index: number) => {
          if (ambiente.id == evento.ambiente.id) {
            indexAmbiente = index;
          }
        });
        switch (evento.horario) {
          case '6-12':
            horario = 'morning';
            break;
          case '12-18':
            horario = 'afternoon';
            break;
          case '18-22':
            horario = 'night';
            break;
        }
        const eventoAmbiente = {
          instructor: instructor,
          ficha: evento.ficha.codigo,
          programa: evento.programa.nombre,
          nivel: evento.nivel,
          competencia: evento.competencia,
          resultado: evento.resultado.resultado,
        };
        const consultaActualizar = {};
        evento.diastrabajados.map((dia) => {
          consultaActualizar[
            `ambientes.${indexAmbiente}.calendario.${dia - 1}.${horario}`
          ] = eventoAmbiente;
        });
        return await this.gestorAmbienteModel.findByIdAndUpdate(
          ambientesSedes.id,
          consultaActualizar,
        );
      }),
    );
  }

  async restarHorarioAmbiente(evento: eliminarEventoEspecificoDto) {
    const ambientesSedes: any = await this.gestorAmbienteModel.findOne({
      'ambientes.id': evento.evento.ambiente.id,
    });

    let ambienteActualizado = ambientesSedes.ambientes.map((ambientes: any) => {
      if (ambientes.id == evento.evento.ambiente.id) {
        switch (evento.evento.horario) {
          case '6-12':
            for (let i = 0; i < evento.evento.diastrabajados.length; i++) {
              ambientes.calendario[
                evento.evento.diastrabajados[i] - 1
              ].morning = null;
            }
            break;
          case '12-18':
            for (let i = 0; i < evento.evento.diastrabajados.length; i++) {
              ambientes.calendario[
                evento.evento.diastrabajados[i] - 1
              ].afternoon = null;
            }
            break;
          case '18-22':
            for (let i = 0; i < evento.evento.diastrabajados.length; i++) {
              ambientes.calendario[evento.evento.diastrabajados[i] - 1].night =
                null;
            }
            break;
        }
      }
      return ambientes;
    });

    return await this.gestorAmbienteModel.findByIdAndUpdate(ambientesSedes.id, {
      $set: { ambientes: ambienteActualizado },
    });
  }

  async findAll() {
    try {
      return this.gestorAmbienteModel.find();
    } catch (error) {
      return new InternalServerErrorException(
        'Ocurrio un error, Revise los logs del sistema.',
      );
    }
  }

  async findByCentro(centro: string) {
    return await this.gestorAmbienteModel
      .find({ centro: centro })
      .populate('sede')
      .then((data) => {
        if (data) {
          return data;
        }
        return new NotFoundException(
          `No se encontraron ambientes para el centro : ${centro}`,
        );
      });
  }

  async findBySede(sede: string) {
    const now = moment().tz('America/Bogota');

    return await this.gestorAmbienteModel.find({ sede: sede }).then((data) => {
      if (data) {
        return data;
      }
      return new NotFoundException(
        `No se encontraron sedes con el id: ${sede}`,
      );
    });
  }

  async reiniciarDisponibilidadCentro(centro: string) {
    await this.gestorAmbienteModel.deleteMany({ centro: centro });
    return await this.crearGestorActual(centro);
  }

  async ambientesPorSede(sede: string): Promise<IAmbiente[] | []> {
    return await this.ambienteModel
      .find({ sede: sede })
      .populate('bloque')
      .populate('sede');
  }
}
