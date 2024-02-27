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
import { NivelDeFormacionService } from './nivel-de-formacion.service';
import {
  NivelDeFormacionDto,
  ActualizarNivelDeFormacionDto,
} from './dto/nivel-de-formacion.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/guard/admin.guard';

@ApiTags('Nivel de formación')
@UseGuards(AdminAuthGuard)
@Controller('nivel-de-formacion')
export class NivelDeFormacionController {
  constructor(
    private readonly nivelDeFormacionService: NivelDeFormacionService,
  ) {}

  @Get()
  obtenerNivelesDeFormacion() {
    return this.nivelDeFormacionService.obtenerNivelesDeFormacion();
  }

  @Post('/crear')
  async crearNivelDeFormacion(
    @Body() nivelDeFormacionDto: NivelDeFormacionDto,
  ) {
    return await this.nivelDeFormacionService.crearNivelDeFormacion(
      nivelDeFormacionDto,
    );
  }

  @Put('/actualizar')
  async actualizarNivelDeFormacion(
    @Body() nivelDeFormacionDto: ActualizarNivelDeFormacionDto,
  ) {
    return await this.nivelDeFormacionService.actualizarNivelDeFormacion(
      nivelDeFormacionDto,
    );
  }

  @Delete('/eliminar/:id')
  async eliminarNivelDeFormacion(@Param('id') id: string) {
    return await this.nivelDeFormacionService.eliminarNivelDeFormacion(id);
  }
}
