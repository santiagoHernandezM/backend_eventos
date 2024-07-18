import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sede } from './schema/sede.schema';
import { Model } from 'mongoose';
import { ActualizarSedeDto, SedeDto } from './dto/sedes.dto';
import { Bloque } from 'src/bloque/schema/bloque.schema';
import { Ambiente } from 'src/ambiente/schemas/ambiente.schema';
import { GestorAmbiente } from 'src/gestor-ambiente/schema/gestor-ambiente.schema';

@Injectable()
export class SedesService {
  constructor(
    @InjectModel(Sede.name) private SedesModel: Model<Sede>,
    @InjectModel(Bloque.name) private bloqueModel: Model<Bloque>,
    @InjectModel(Ambiente.name) private ambienteModel: Model<Ambiente>,
    @InjectModel(GestorAmbiente.name)
    private gestorAmbiente: Model<GestorAmbiente>,
  ) {}

  async obtenerTodo(): Promise<NotFoundException | Sede[]> {
    return await this.SedesModel.find()
      .populate('centro')
      .populate({
        path: 'centro',
        populate: [
          {
            path: 'regional',
          },
        ],
      })
      .then((data) => {
        if (data) {
          return data;
        } else {
          return new NotFoundException('No se encontraron documentos en sedes');
        }
      });
  }

  async getSede(sede: string): Promise<Sede> {
    return await this.SedesModel.findOne({ _id: sede });
  }
  
  async crearSede(sedeDto: SedeDto): Promise<NotFoundException | Sede> {
    const sedes = new this.SedesModel(sedeDto);
    return await sedes.save().then(async (sede) => {
      //Creamos el gestor de ambientes para la sede creada
      await this.gestorAmbiente.create({
        ambientes: [],
        centro: sede.centro,
        sede: sede._id,
      });
      return sede;
    });
  }

  async borrarSede(id: string) {
    try {
      // Eliminación de bloques
      const bloques = await this.bloqueModel.find({ sede: id });
      if (bloques.length > 0) {
        await this.bloqueModel.deleteMany({ sede: id });
      }

      // Eliminación de ambientes
      const ambientes = await this.ambienteModel.find({ sede: id });
      if (ambientes.length > 0) {
        await this.ambienteModel.deleteMany({ sede: id });
      }
    } catch (error) {
      console.log(error);
    }

    return await this.SedesModel.findByIdAndRemove(id).then((data) => {
      if (data) {
        return data;
      } else {
        return new NotFoundException(
          `No se encontro el documento con id:${id} en sede`,
        );
      }
    });
  }

  async actualizarSede(sede: ActualizarSedeDto) {
    return await this.SedesModel.findByIdAndUpdate(sede.id, sede).then(
      (data) => {
        return data
          ? data
          : new NotFoundException(`No se encontro el sede con id:${sede.id}`);
      },
    );
  }

  async sedesPorCentro(idCentro: string) {
    return await this.SedesModel.find({
      centro: idCentro,
    })
      // .populate('centro')
      .populate({
        path: 'centro',
        populate: {
          path: 'regional',
        },
      });
  }
}
