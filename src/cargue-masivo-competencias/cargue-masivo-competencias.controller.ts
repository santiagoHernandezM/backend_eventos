import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CargueMasivoCompetenciasService } from './cargue-masivo-competencias.service';
import { diskStorage } from 'multer';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/auth/guards/admin.guard';

@ApiTags('Carga masiva de competencias')
//@UseGuards(AdminAuthGuard)
@Controller('carguemasivocompetencias')
export class CargueMasivoCompetenciasController {
  constructor(private readonly cargue: CargueMasivoCompetenciasService) {}
  @ApiBody({
    type: 'ObjectId',
    description: 'Programa: ObjectId del programa',
  })
  @Post('cargar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}.${
              file.originalname.split('.')[1]
            }`,
          );
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('programa') programa: string,
  ): Promise<string> {
    const result = await this.cargue.processCsv(file, programa);
    return result;
  }

  @Post('cargarinstructor')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}.${
              file.originalname.split('.')[1]
            }`,
          );
        },
      }),
    }),
  )
  async uploadFileInstructor(
    @UploadedFile() file: Express.Multer.File,
    @Body('centro') centro: string,
  ): Promise<string> {
    const result = await this.cargue.processInstructor(file, centro);
    return result;
  }

  @Post('cargarprogramas')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}.${
              file.originalname.split('.')[1]
            }`,
          );
        },
      }),
    }),
  )
  async uploadFileProgramas(
    @UploadedFile() file: Express.Multer.File,
    @Body('centro') centro: string,
  ): Promise<string> {
    const result = await this.cargue.processProgramas(file);
    return result;
  }

  @Post('/cargarfichas')
  @UseInterceptors(
    FileInterceptor('fichas', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = file.originalname.split('.');
          cb(null, `${file.fieldname}-${uniqueSuffix}.${ext[ext.length - 1]}`);
        },
      }),
    }),
  )
  async uploadFileFichas(@UploadedFile() fichas: Express.Multer.File) {
    return await this.cargue.processFichas(fichas);
  }
}
