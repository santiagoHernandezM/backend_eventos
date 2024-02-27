import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JornadaService } from './jornada.service';
import { CrearJornadaDto, ActualizarJornadaDto } from './dto/jornada.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/guard/admin.guard';
@ApiTags('Jornada')
@UseGuards(AdminAuthGuard)
@Controller('jornada')
export class JornadaController {
  constructor(private readonly jornadaService: JornadaService) {}

  @Get()
  async obtenerJornadas() {
    return await this.jornadaService.obtenerJornadas();
  }

  @Get('/:id')
  async obtenerJornada(@Param('id') id: string) {
    return await this.jornadaService.obtenerJornada(id);
  }

  @Post('/crear')
  async crearBloque(@Body() jornada: CrearJornadaDto) {
    return await this.jornadaService.crearJornada(jornada);
  }

  @Put('/actualizar')
  async actualizarJornada(@Body() jornada: ActualizarJornadaDto) {
    return await this.jornadaService.actualizarJornada(jornada);
  }

  @Delete('/eliminar/:id')
  async eliminarJornada(@Param('id') id: string) {
    return await this.jornadaService.eliminarJornada(id);
  }
}
