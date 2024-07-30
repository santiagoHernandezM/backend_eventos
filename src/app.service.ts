import { Injectable } from '@nestjs/common';
import { GestorAmbienteService } from './gestor-ambiente/gestor-ambiente.service';
import { Cron } from '@nestjs/schedule';
import { CentroService } from './centro/centro.service';

@Injectable()
export class AppService {
  constructor(
    private readonly gestorAmbienteService: GestorAmbienteService,
    private readonly centroService: CentroService,
  ) {}
  getHello(): string {
    return 'Hola Sena!';
  }

  //Se ejecuta el 1 de cada mes a 1 de la madrugada
  @Cron('0 1 1 * *', {
    timeZone: 'America/Bogota',
  })
  async registrarCronGestorAmbiente() {
    const nombre_ccit = 'CENTRO DE COMERCIO, INDUSTRIA Y TURISMO CCIT';
    const centro = await this.centroService.getCentroByNombre(nombre_ccit);

    if (centro !== null) {
      await this.gestorAmbienteService.reiniciarDisponibilidadCentro(centro.id);
    } else {
      console.log('No se encontró el centro de pruebas', centro);
    }
  }
}
