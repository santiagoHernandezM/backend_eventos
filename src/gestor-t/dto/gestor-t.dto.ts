import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import { competenciaDto } from './competencia.dto';

export class GestorTDto {
  @IsMongoId()
  @IsNotEmpty({ message: 'El id de la ficha no puede estar vacío' })
  readonly ficha: string;

  @IsNotEmpty({ message: 'La duración del gestor no puede estar vacío' })
  readonly duracion: number;

  @IsNotEmpty({ message: 'La duración del gestor no puede estar vacío' })
  readonly acumulado: number;

  @IsArray()
  @IsNotEmpty({ message: 'Las competencias no pueden estar vacías' })
  readonly competencias: competenciaDto[];
}
