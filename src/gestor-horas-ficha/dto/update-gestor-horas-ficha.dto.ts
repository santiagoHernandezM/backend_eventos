import { PartialType } from '@nestjs/swagger';
import { CreateGestorHorasFichaDto } from './create-gestor-horas-ficha.dto';

export class UpdateGestorHorasFichaDto extends PartialType(CreateGestorHorasFichaDto) {}
