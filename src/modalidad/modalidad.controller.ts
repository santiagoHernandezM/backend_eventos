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
import { ModalidadService } from './modalidad.service';
import { ActualizarModalidadDto, ModalidadDto } from './dto/modalidad.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/guard/admin.guard';

@ApiTags('Modalidad')
@UseGuards(AdminAuthGuard)
@Controller('modalidad')
export class ModalidadController {
  constructor(private readonly modalidadService: ModalidadService) {}

  @Get()
  async obtenerModalidades() {
    return await this.modalidadService.obtenerModalidades();
  }

  @Get('/:id')
  async obtenerModalidad(id: string) {
    return await this.modalidadService.obtenerModalidad(id);
  }

  @Post('/crear')
  async crearModalidad(@Body() modalidadDto: ModalidadDto) {
    return await this.modalidadService.crearModalidad(modalidadDto);
  }

  @Put('/actualizar')
  async actualizarModalidad(@Body() modalidadDto: ActualizarModalidadDto) {
    return await this.modalidadService.actualizarModalidad(modalidadDto);
  }

  @Delete('/eliminar/:id')
  async eliminarModalidad(@Param('id') id: string) {
    return await this.modalidadService.eliminarModalidad(id);
  }
}
