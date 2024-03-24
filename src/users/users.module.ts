import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UsersController } from './users.controller';
import { ProgramaModule } from 'src/programa/programa.module';
import {
  InstructoresPrograma,
  InstructoresProgramaSchema,
} from 'src/programa/schema/instructoresprograma.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: InstructoresPrograma.name, schema: InstructoresProgramaSchema },
    ]),
    ProgramaModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
