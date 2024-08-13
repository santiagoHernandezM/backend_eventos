import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { GestorTService } from './gestor-t.service';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { CoordinadorAuthGuard } from 'src/auth/guards/coordinador.guard';
import { UpdateGestorTDto } from './dto/gestor-t.dto';

@ApiTags('Gestor de tiempo')
//@UseGuards(CoordinadorAuthGuard)
@Controller('gestor-t')
export class GestorTController {
  constructor(private readonly gestorTService: GestorTService) {}

  @Get()
  async obtenerTodo() {
    return await this.gestorTService.obtenerTodo();
  }
  @ApiParam({
    description: 'ObjectId de la ficha',
    name: 'ficha',
  })
  @Get('/:ficha')
  async obtenerGestor(@Param('ficha') ficha: string) {
    return await this.gestorTService.obtenerGestor(ficha);
  }

  @ApiBody({
    description: 'Actualizar tiempos del gestor de una ficha',
    type: UpdateGestorTDto,
  })
  @Put()
  async actualizarGestorT(@Body() updateGestorT: UpdateGestorTDto) {
    return await this.gestorTService.actualizarGestor(updateGestorT);
  }
}
