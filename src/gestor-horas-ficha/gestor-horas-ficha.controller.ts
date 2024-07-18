import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GestorHorasFichaService } from './gestor-horas-ficha.service';
import { CreateGestorHorasFichaDto } from './dto/create-gestor-horas-ficha.dto';
import { UpdateGestorHorasFichaDto } from './dto/update-gestor-horas-ficha.dto';

@Controller('gestor-horas-ficha')
export class GestorHorasFichaController {
  constructor(
    private readonly gestorHorasFichaService: GestorHorasFichaService,
  ) {}

  @Get()
  findAll() {
    return this.gestorHorasFichaService.findAll();
  }

  @Get('/programa/:programa')
  async getGestorFichasPorPrograma(@Param('programa') programa: string) {
    return await this.gestorHorasFichaService.getGestorFichasPorPrograma(programa);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGestorHorasFichaDto: UpdateGestorHorasFichaDto,
  ) {
    return this.gestorHorasFichaService.update(+id, updateGestorHorasFichaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gestorHorasFichaService.remove(+id);
  }
}
