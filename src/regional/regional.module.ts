import { Module } from '@nestjs/common';
import { RegionalController } from './regional.controller';
import { RegionalService } from './regional.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Regional, RegionalSchema } from './schema/regional.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Regional.name, schema: RegionalSchema },
    ]),
  ],
  controllers: [RegionalController],
  providers: [RegionalService],
  exports: [RegionalService],
})
export class RegionalModule {}
