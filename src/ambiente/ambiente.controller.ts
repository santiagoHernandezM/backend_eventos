import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AmbienteService } from './ambiente.service';
import { CreatedAmbienteDTO, UpdateAmbienteDTO } from './dto/ambiente.dto';
import { ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/guard/admin.guard';

@ApiTags('Ambiente')
@UseGuards(AdminAuthGuard)
@Controller('ambiente')
export class AmbienteController {
  constructor(private readonly ambienteService: AmbienteService) {}

  @Get()
  async getAllAmbientes() {
    return this.ambienteService.getAllAmbientes();
  }

  @Get(':id')
  async getByIdAmbiente(@Param('id') idAmbiente: string) {
    const found = await this.ambienteService.getByIdAmbiente(idAmbiente);
    return found;
  }
  @Get('/sede/:id')
  async ambientesPorSede(@Param('id') id: string) {
    return await this.ambienteService.ambientesPorSede(id);
  }
  @Post('crear')
  async createdAmbiente(@Body() ambienteCreatedDTO: CreatedAmbienteDTO) {
    const newAmbiente =
      this.ambienteService.createdAmbiente(ambienteCreatedDTO);
    return newAmbiente;
  }

  @Put('editar')
  async updateAmbiente(@Body() updateAmbiente: UpdateAmbienteDTO) {
    const updAmbiente =
      await this.ambienteService.updateAmbiente(updateAmbiente);
    return updAmbiente;
  }

  @Delete(':id')
  async deleteAmbiente(@Param('id') idAmbiente: string) {
    const delAmbiente = this.ambienteService.deleteAmbiente(idAmbiente);
    return delAmbiente;
  }
}
