import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import { TipoAmbienteService } from './tipo-ambiente.service';
import {
  CreatedTipoAmbienteDTO,
  UpdateTipoAmbienteDTO,
} from './dto/tipo-ambiente.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/auth/guards/admin.guard';

@ApiTags('Tipo Ambiente')
// @UseGuards(AdminAuthGuard)
@Controller('tipo-ambiente')
export class TipoAmbienteController {
  constructor(private readonly tipoAmbientService: TipoAmbienteService) {}

  @Get()
  async getAllTiposAmb() {
    return await this.tipoAmbientService.getAllTipos();
  }

  @Get(':id')
  async getByIdTiposAmb(@Param('id') idTipoAmbiente: string) {
    const found = this.tipoAmbientService.getByIdTipos(idTipoAmbiente);
    return found;
  }

  @Post('crear')
  async crearTipoAmb(@Body() crearTipoAmb: CreatedTipoAmbienteDTO) {
    const newTipoAmb =
      await this.tipoAmbientService.createdTipoAmb(crearTipoAmb);
    return newTipoAmb;
  }

  @Put('/actualizar')
  async actualizarTipoAmb(
    @Body() updateTipoAmbienteDTO: UpdateTipoAmbienteDTO,
  ) {
    return await this.tipoAmbientService.actualizarTipoAmb(
      updateTipoAmbienteDTO,
    );
  }

  @Delete('/eliminar/:id')
  async deleteTipoAmb(@Param('id') id: string) {
    return await this.tipoAmbientService.eliminarTipoAmb(id);
  }
}
