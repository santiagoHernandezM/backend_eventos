import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { ValidateObjectidPipe } from 'src/common/validate-objectid/validate-objectid.pipe';
import { AdminAuthGuard } from 'src/guard/admin.guard';

@ApiTags('Usuarios')
@UseGuards(AdminAuthGuard)
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiParam({
    name: 'name',
    description: 'nombre del usuario',
    required: true,
  })
  @Get('find-one/:name')
  async findOne(@Param('name') name: string) {
    return await this.usersService.findOne(name);
  }

  @Get('/instructor')
  async getInstructo() {
    return await this.usersService.getInstructor();
  }

  @ApiParam({
    name: 'id',
    description: 'El id de un instructor',
    required: true,
  })
  @Get('instructor/:id')
  async getInstructorById(@Param('id', ValidateObjectidPipe) id: string) {
    return await this.usersService.getInstructorById(id);
  }

  @ApiBody({
    type: UserDto,
  })
  @Post('/crear')
  async crear(@Body(new ValidationPipe({ transform: true })) user: UserDto) {
    return await this.usersService.crearUser(user);
  }

  @Get('roles')
  async roles() {
    return await this.usersService.roles();
  }

  @ApiParam({ name: 'programa', type: String, description: 'Id del programa' })
  @ApiParam({ name: 'centro', type: String, description: 'Id del centro' })
  @Get('programa/centro/:programa/:centro')
  async instructorByProgramaByCentro(
    @Param('programa', ValidateObjectidPipe) programa: string,
    @Param('centro', ValidateObjectidPipe) centro: string,
  ) {
    return await this.usersService.instructorByProgramaByCentro(
      programa,
      centro,
    );
  }
}
