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
import { TipoDeVinculacionService } from './tipo-de-vinculacion.service';
import {
  TipoDeVinculacionDto,
  ActualizarTipoDeVinculacionDto,
} from './dto/tipo-de-vinculacion.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/guard/admin.guard';

@ApiTags('Tipo de vinculación')
@UseGuards(AdminAuthGuard)
@Controller('tipo-de-vinculacion')
export class TipoDeVinculacionController {
  constructor(
    private readonly tipoDeVinculacionService: TipoDeVinculacionService,
  ) {}

  @Get()
  obtenerTipoDeVinculaciones() {
    return this.tipoDeVinculacionService.obtenerTipoDeVinculaciones();
  }

  @Post('/crear')
  async crearTipoDeVinculacion(
    @Body() tipoDeVinculacion: TipoDeVinculacionDto,
  ) {
    return await this.tipoDeVinculacionService.crearTipoDeVinculacion(
      tipoDeVinculacion,
    );
  }

  @Put('/actualizar')
  async actualizarTipoDeVinculacion(
    @Body() tipoDeVinculacion: ActualizarTipoDeVinculacionDto,
  ) {
    return await this.tipoDeVinculacionService.actualizarTipoDeVinculacion(
      tipoDeVinculacion,
    );
  }

  @Delete('/eliminar/:id')
  async eliminarTipoDeVinculacion(@Param('id') id: string) {
    return await this.tipoDeVinculacionService.eliminarTipoDeVinculacion(id);
  }
}
