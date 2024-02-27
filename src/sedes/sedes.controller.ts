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
import { SedesService } from './sedes.service';
import { ActualizarSedeDto, SedeDto } from './dto/sedes.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CoordinadorAuthGuard } from 'src/guard/coordinador.guard';

@ApiTags('Sedes')
@UseGuards(CoordinadorAuthGuard)
@Controller('sedes')
export class SedesController {
  constructor(private readonly sede: SedesService) {}

  @Get()
  async obtenerTodo() {
    return await this.sede.obtenerTodo();
  }
  @Post('/crear')
  async crearSedes(@Body() sede: SedeDto) {
    return await this.sede.crearSede(sede);
  }

  @Delete(':id')
  async borrarSedes(@Param('id') id: string) {
    return await this.sede.borrarSede(id);
  }

  @Put('actualizar')
  async actualizarSedes(@Body() sede: ActualizarSedeDto) {
    return await this.sede.actualizarSede(sede);
  }

  @ApiParam({
    name: 'centro',
    description: 'Identificador del Centro para obtener las Sedes',
  })
  @Get('centro/:centro')
  async obtenerSedesPorCentro(@Param('centro') centro: string) {
    return await this.sede.sedesPorCentro(centro);
  }
}
