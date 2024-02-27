import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { EventoService } from './evento.service';
import { eventoDto } from './dto/evento.dto';
import {
  eliminarEventoDto,
  eliminarEventoEspecificoDto,
} from './dto/eliminarEvento.dto';
import { InstructorAuthGuard } from 'src/guard/instructor.guard';

@ApiTags('Evento')
@UseGuards(InstructorAuthGuard)
@Controller('evento')
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  @Get()
  async obtenerEventos() {
    return await this.eventoService.obtenerEventos();
  }

  @ApiBody({ type: eventoDto })
  @Post('/crear')
  async crearEvento(@Body() evento: eventoDto) {
    return await this.eventoService.crearEvento(evento);
  }

  @Get('/fecha/:mes/:year/ambiente/:ambiente/horario/:horario')
  async obtenerEventosPorFecha(
    @Param('mes') mes: number,
    @Param('year') year: number,
    @Param('ambiente') ambiente: string,
    @Param('horario') horario: string,
  ) {
    return await this.eventoService.obtenerEventosPorFecha(
      mes,
      year,
      ambiente,
      horario,
    );
  }

  @Get('/especificos/:mes/:year/:instructor/:instructor')
  async obtenerEventosEspecificos(
    @Param('mes') mes: number,
    @Param('year') year: number,
    @Param('instructor') instructor: string,
  ) {
    return await this.eventoService.obtenerEventosEspecificos(
      mes,
      year,
      instructor,
    );
  }

  @Get('/validar-tiempos')
  async validarTiempos(@Body() payload: eventoDto) {
    return await this.eventoService.validarTiempos(payload);
  }

  @Delete('/eliminar')
  async eliminarEvento(@Body() payload: eliminarEventoDto) {
    return this.eventoService.eliminarEvento(payload);
  }

  @ApiBody({
    type: eliminarEventoEspecificoDto,
  })
  @Post('/eliminar/especifico')
  async eliminarEventoEspecifico(
    @Body() eventoEspecificoDto: eliminarEventoEspecificoDto,
  ) {
    console.log(eventoEspecificoDto);

    return await this.eventoService.eliminarEventoEspecifico(
      eventoEspecificoDto,
    );
  }

  @ApiParam({
    name: 'month',
    type: Number,
    description: 'Número del mes a obtener reportes',
  })
  @ApiParam({
    name: 'year',
    type: Number,
    description: 'Número del mes a obtener reportes',
  })
  @Get('/reporte/:year/:month')
  async obtenerReporteDeEventos(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ) {
    return this.eventoService.reporteDeEvento(year, month);
  }
}
