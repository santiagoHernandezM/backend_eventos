import { Module } from '@nestjs/common';
import { ProgramaController } from './programa.controller';
import { ProgramaService } from './programa.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Programa, ProgramaSchema } from './schema/programa.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Programa.name, schema: ProgramaSchema },
    ]),
  ],
  controllers: [ProgramaController],
  providers: [ProgramaService],
  exports: [ProgramaService],
})
export class ProgramaModule {}
