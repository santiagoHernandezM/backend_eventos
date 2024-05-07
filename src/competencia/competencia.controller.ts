import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CompetenciaService } from './competencia.service';
import {
  actualizarCompetenciaDto,
  competenciaDto,
} from './dto/competencia.dto';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/auth/guards/admin.guard';

@ApiTags('Competencia')
// @UseGuards(AdminAuthGuard)
@Controller('competencia')
export class CompetenciaController {
  constructor(private readonly competenciaService: CompetenciaService) {}

  @Get()
  obtenerCompetencias() {
    return this.competenciaService.obtenerCompetencias();
  }

  @ApiParam({ name: 'idProgram', type: String })
  @Get('/programa/:idProgram')
  obtenerCompetenciasPorPrograma(@Param('idProgram') idProgram: string) {
    return this.competenciaService.obtenerCompetenciasPorPrograma(idProgram);
  }

  @ApiParam({
    name: 'idPrograma',
    type: String,
    description: 'Id del programa asociado a la competencia',
  })
  @ApiParam({
    name: 'cocompetencia',
    type: String,
    description: 'Codigo de la competencia',
  })
  @Get('programa/:idPrograma/cocompetencia/:cocompetencia')
  obtenerCompetenciaPorCodigo(
    @Param('idPrograma') idPrograma: string,
    @Param('cocompetencia') cocompetencia: string,
  ) {
    return this.competenciaService.obtenerCompetenciaPorCodigo(
      idPrograma,
      cocompetencia,
    );
  }

  @ApiBody({ type: competenciaDto })
  @Post('/crear')
  crearCompetencia(@Body() competencia: competenciaDto) {
    return this.competenciaService.crearCompetencia(competencia);
  }

  @ApiBody({ type: actualizarCompetenciaDto })
  @Put('/actualizar/')
  actualizarResultados(@Body() resultado: actualizarCompetenciaDto) {
    return this.competenciaService.actualizarResultados(resultado);
  }
}
