/* eslint-disable @typescript-eslint/no-var-requires */
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import * as moment from 'moment-timezone';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
//import moment from 'moment';
// import fc from 'festivos-colombia';
const fc = require('festivos-colombia');

//@UseGuards(JwtAuthGuard)
@Controller()
export class AppController {
  private meses: string[] = [];
  constructor(private readonly appService: AppService) {
    this.meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('date')
  getDatosFecha() {
    const now = moment().tz('America/Bogota');
    return {
      mesNum: now.month() + 1,
      mes: this.meses[now.month()],
      year: now.year(),
    };
  }

  /**
   * Obtener festivos filtrando por año y por mes
   * @param year Año para consultar los festivos
   * @param month Mes para consultar los festivos
   * @returns Lista de festivos
   */
  @Get('festivos/:year/:month')
  getFestivos(@Param('year') year: string, @Param('month') month: string) {
    const diasFestivos = fc.getHolidaysByYear(year);
    const festivosResponse = [];

    diasFestivos.forEach((element) => {
      const mes = element.date.split('/')[1];
      if (mes == month) {
        festivosResponse.push(element);
      }
    });

    return festivosResponse;
  }
}
