import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BloqueService } from './bloque.service';
import { CrearBloqueDto, ActualizarBloqueDto } from './dto/bloque.dto';
import { ApiTags } from '@nestjs/swagger';
import { InstructorAuthGuard } from 'src/guard/instructor.guard';

// @UseGuards(InstructorAuthGuard)
@ApiTags('Bloque')
@Controller('bloque')
export class BloqueController {
  constructor(private readonly bloqueService: BloqueService) {}

  @Get()
  async findAllBlock() {
    return await this.bloqueService.obtenerBloques();
  }

  @Get('/:id')
  async findOneBlock(@Param('id') id: string) {
    return await this.bloqueService.obtenerBloque(id);
  }

  @Get('/sede/:id')
  async findBlockForSede(@Param('id') id: string) {
    return await this.bloqueService.getBloqueForSede(id);
  }

  @Post('/crear')
  async crearBloque(@Body() bloqueDto: CrearBloqueDto) {
    return await this.bloqueService.crearBloque(bloqueDto);
  }

  @Put('/actualizar')
  async actualizarBloque(@Body() bloqueDto: ActualizarBloqueDto) {
    return await this.bloqueService.actualizarBloque(bloqueDto);
  }

  @Delete('/eliminar/:id')
  async deleteBlock(@Param('id') id: string) {
    return await this.bloqueService.eliminarBloque(id);
  }
}
