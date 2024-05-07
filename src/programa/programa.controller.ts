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
import { ProgramaService } from './programa.service';
import { ActualizarProgramaDto, ProgramaDto } from './dto/programa.dto';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { InstructorAuthGuard } from 'src/auth/guards/instructor.guard';

@ApiTags('Programas')
// @UseGuards(InstructorAuthGuard)
@Controller('programas')
export class ProgramaController {
  constructor(private readonly Programa: ProgramaService) {}

  @Get()
  async obtenerTodo() {
    return await this.Programa.obtenerTodo();
  }

  @ApiParam({ name: 'id', type: String, description: 'El id de un programa' })
  @Get('/:id')
  async obtenerPrograma(@Param('id') id: string) {
    return await this.Programa.obtenerProgramaId(id);
  }

  @Get('/intensidad/:id/:intesidad')
  async obtenerProgramaPorIntensidad(
    @Param('id') id: string,
    @Param('intesidad') intensidad: number,
  ) {
    return await this.Programa.obtenerProgramaPorIntensidad(id, intensidad);
  }

  @Get('/instructoresprograma/:programa')
  async obtenerInstructoresPorPrograma(@Param('programa') programa: string) {
    return await this.Programa.obtenerInstructoresPorPrograma(programa);
  }

  @ApiBody({
    type: ProgramaDto,
  })
  @Post('/crear')
  async crearProgramas(@Body() Programa: ProgramaDto) {
    return await this.Programa.crearPrograma(Programa);
  }

  @ApiParam({ name: 'id', type: Number, description: 'El id de un programa' })
  @Delete('/eliminar/:id')
  async borrarProgramas(@Param('id') id: string) {
    return await this.Programa.borrarPrograma(id);
  }

  @ApiBody({
    type: ActualizarProgramaDto,
  })
  @Put('actualizar')
  async actualizarProgramas(@Body() Programa: ActualizarProgramaDto) {
    return await this.Programa.actualizarPrograma(Programa);
  }
}
