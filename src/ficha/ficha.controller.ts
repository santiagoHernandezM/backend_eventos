import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FichaService } from './ficha.service';
import { FichaDto, ActualizarFichaDto } from './dto/ficha.dto';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { Centro } from 'src/centro/schema/centro.schema';

@ApiTags('Ficha')
@Controller('ficha')
export class FichaController {
  constructor(private readonly fichaService: FichaService) {}

  @Get()
  async obtenerTodo() {
    return await this.fichaService.obtenerTodo();
  }

  @ApiParam({ name: 'id', type: String, description: 'id de la ficha' })
  @Get('/:id')
  async obtenerFicha(@Param('id') id: string) {
    return await this.fichaService.obtenerFicha(id);
  }

  @ApiParam({ name: 'id', type: String, description: 'ObjectId del programa' })
  @Get('programas/:id')
  async obtenerFichasPorPrograma(@Param('id') id: string) {
    return await this.fichaService.obtenerFichasPorPrograma(id);
  }

  @ApiParam({
    name: 'programa',
    description: 'ObjectId del programa asociado a la Ficha',
  })
  @Get('programa/:programa/centro/:centro')
  async obtenerFichasPorCentro(
    @Param('programa') programas: string,
    @Param('centro') centro: string,
  ) {
    return await this.fichaService.obtenerFichasPorCentro(programas, centro);
  }

  @Get('/usuario/:id')
  async fichasPorUsuario(@Param('id') id: string) {
    return await this.fichaService.fichasPorUsuario(id);
  }

  @ApiBody({
    type: FichaDto,
  })
  @Post('/crear')
  async crearFicha(@Body() ficha: FichaDto) {
    return await this.fichaService.crearFicha(ficha);
  }

  @ApiBody({
    type: ActualizarFichaDto,
  })
  @Put('/actualizar')
  async actualizarFicha(@Body() ficha: ActualizarFichaDto) {
    return await this.fichaService.actualizarFicha(ficha);
  }

  @ApiParam({ name: 'id', type: String, description: 'id de la ficha' })
  @Delete('/eliminar/:id')
  async eliminarFicha(@Param('id') id: string) {
    return await this.fichaService.eliminarFicha(id);
  }

  @ApiParam({
    name: 'programa',
    description: 'ObjectId del programa asociado a la Ficha',
  })
  @Get('programa/:programa/sede/:sede')
  async fichaPorProgramaSede(
    @Param('programa') programa: string,
    @Param('sede') sede: string,
  ) {
    return this.fichaService.fichaPorProgramaYSede(programa, sede);
  }
}
