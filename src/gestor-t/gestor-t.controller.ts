import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { GestorTService } from './gestor-t.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CoordinadorAuthGuard } from 'src/guard/coordinador.guard';

@ApiTags('Gestor de tiempo')
@UseGuards(CoordinadorAuthGuard)
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
}
