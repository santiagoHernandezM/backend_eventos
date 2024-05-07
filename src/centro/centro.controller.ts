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
import { CentroService } from './centro.service';
import { CentroDto, ActualizarCentroDto } from './dto/centro.dto';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { InstructorAuthGuard } from 'src/auth/guards/instructor.guard';
import { AdminAuthGuard } from 'src/auth/guards/admin.guard';

@ApiTags('Centro')
// @UseGuards(AdminAuthGuard)
//@UseGuards(InstructorAuthGuard)
@Controller('centro')
export class CentroController {
  constructor(private readonly centro: CentroService) {}

  @Get()
  async obtenerTodo() {
    return await this.centro.obtenerTodo();
  }

  @ApiParam({
    name: 'id',
    description: 'ObjectId del centro',
  })
  @Get('/:id')
  async obtenerCentroPorId(@Param('id') id: string) {
    return await this.centro.centroPorId(id);
  }

  @ApiBody({
    type: CentroDto,
  })
  @Post('/crear')
  async crearCentro(@Body() centro: CentroDto) {
    return await this.centro.crearCentro(centro);
  }

  @ApiParam({
    description: 'Id del centro',
    name: 'id',
  })
  @Delete('/eliminar/:id')
  async eliminarCentro(@Param('id') id: string) {
    return await this.centro.eliminarCentro(id);
  }

  @ApiBody({
    type: ActualizarCentroDto,
  })
  @Put('/editar')
  async actualizarCentro(@Body() centro: ActualizarCentroDto) {
    return await this.centro.actualizarCentro(centro);
  }
}
