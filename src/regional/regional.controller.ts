import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ActualizarRegionalDto, RegionalDto } from './dto/regional.dto';
import { RegionalService } from './regional.service';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { ValidateObjectidPipe } from 'src/common/validate-objectid/validate-objectid.pipe';
import { AdminAuthGuard } from 'src/auth/guards/admin.guard';

@ApiTags('Regional')
// @UseGuards(AdminAuthGuard)
@Controller('regional')
export class RegionalController {
  constructor(private readonly regional: RegionalService) {}
  @Get()
  async obtenerRegionales() {
    return await this.regional.obtenerRegionales();
  }

  @ApiParam({
    name: 'id',
    description: 'id de la regional',
  })
  @Get('/:id')
  async obtenerRegionalId(@Param('id', ValidateObjectidPipe) id: string) {
    try {
      return await this.regional.obtenerRegionalId(id);
    } catch (error) {
      throw new BadRequestException(`Error al buscar la Regional: ${id}`);
    }
  }

  @ApiBody({
    type: RegionalDto,
  })
  @Post('/crear')
  async crearRegional(@Body() regional: RegionalDto) {
    return await this.regional.crearRegional(regional);
  }

  @ApiParam({
    name: 'id',
    description: 'id de la regional',
  })
  @Delete('/eliminar/:id')
  async eliminarRegional(@Param('id') id: string) {
    return await this.regional.eliminarRegional(id);
  }

  // modificar
  // @Put('modificar/:id')
  // async updateRegional(@Param('id') id: string, @Body() payload: any) {
  //   return await this.regional.update_regional(id, payload);
  // }

  @Put('actualizar')
  async actualizarRegional(@Body() payload: ActualizarRegionalDto) {
    return await this.regional.actualizarRegional(payload);
  }
}
