import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ActualizarUserDto, UserDto } from './dto/user.dto';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { ValidateObjectidPipe } from 'src/common/validate-objectid/validate-objectid.pipe';
import { AsignarProgramaDto } from './dto/asignarprograma.dto';
import { CreateEmailDto } from 'src/email/dto/create-email.dto';
import { NewPasswordDto } from './dto/new-password.dto';
import { IncomingHttpHeaders } from 'http';

@ApiTags('Usuarios')
// @UseGuards(AdminAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiParam({
    name: 'nombre',
    description: 'nombre del usuario',
    required: true,
  })
  @Get('/nombre/:nombre')
  async findOne(@Param('nombre') nombre: string) {
    return await this.usersService.findOne(nombre);
  }

  @ApiParam({
    name: 'id',
    description: 'El id de un instructor',
    required: true,
  })
  @Get('/instructor/:id')
  async getInstructorById(@Param('id', ValidateObjectidPipe) id: string) {
    return await this.usersService.obtenerInstructorPorId(id);
  }

  @Get('/instructor/:id/centro/:centro')
  async obtenerInstructorPorCentro(
    @Param('id', ValidateObjectidPipe) id: string,
    @Param('centro') centro: string,
  ) {
    return await this.usersService.obtenerInstructorPorCentro(id, centro);
  }

  @Get()
  async obtenerTodo() {
    return await this.usersService.obtenerTodo();
  }

  @Get('/instructores')
  async obtenerInstructores() {
    return await this.usersService.obtenerInstructores();
  }

  // @Get('/instructor/:id/centro/:centro')
  // async obtenerInstructorPorCentro(
  //   @Param('id') id: string,
  //   @Param('centro') centro: string,
  // ) {
  //   return await this.usersService.obtenerInstructorPorCentro(id, centro);
  // }

  @Get('/instructores/centro/:centro')
  async obtenerInstructoresPorCentro(@Param('centro') centro: string) {
    return await this.usersService.obtenerInstructoresPorCentro(centro);
  }

  @Get('roles')
  async roles() {
    return await this.usersService.roles();
  }

  @ApiParam({
    name: 'id',
    type: String,
    description: 'ObjectId del usuario coordinador',
  })
  @Get('/coordinador/:id/programas/instructores')
  async getInstructoresProgramas(@Param('id') id: string) {
    return await this.usersService.getInstructoresProgramas(id);
  }

  @Get('/coordinador/:id')
  async getProgramasCoordinador(@Param('id') id: string) {
    return await this.usersService.getProgramasCoordinador(id);
  }

  @ApiParam({ name: 'programa', type: String, description: 'Id del programa' })
  @ApiParam({ name: 'centro', type: String, description: 'Id del centro' })
  @Get('instructores/programa/:programa/centro/:centro')
  async instructorByProgramaByCentro(
    @Param('programa', ValidateObjectidPipe) programa: string,
    @Param('centro', ValidateObjectidPipe) centro: string,
  ) {
    return await this.usersService.instructorByProgramaByCentro(
      programa,
      centro,
    );
  }

  @ApiBody({
    type: UserDto,
  })
  @Post('/crear')
  async crear(@Body(new ValidationPipe({ transform: true })) user: UserDto) {
    return await this.usersService.crearUser(user);
  }

  @Post('/asignarprogramas/instructores')
  async asignarprogramas(
    @Body(new ValidationPipe({ transform: true }))
    asignarProgramaDto: AsignarProgramaDto,
  ) {
    return this.usersService.asignarprograma(asignarProgramaDto);
  }

  @Post('/forgot-password')
  forgotPassword(@Body() createEmailDto: CreateEmailDto) {
    return this.usersService.forgotPassword(createEmailDto);
  }

  @Post('/reset-password')
  resetPassword(
    @Body() newPasswordDto: NewPasswordDto,
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return this.usersService.resetPassword(newPasswordDto, headers);
  }

  @Put('actualizar')
  async actualizarUsuario(@Body() User: ActualizarUserDto) {
    return await this.usersService.actualizarUsuario(User);
  }

  @ApiParam({
    name: 'id',
    type: String,
    description: 'ObjectId del usuario a cambiar el estado(activo)',
  })
  @ApiParam({
    name: 'estado',
    type: Boolean,
    description: 'Nuevo estado del usuario (true/false)',
  })
  @Put('/:id/nuevo_estado/:estado')
  async cambiarEstadoUsuario(
    @Param('id') id: string,
    @Param('estado') nuevo: boolean,
  ) {
    return await this.usersService.cambiarEstadoUsuario(id, nuevo);
  }

  @Delete('eliminar/:id')
  eliminarUsuario(@Param('id') id: string) {
    return this.usersService.eliminarUsuario(id);
  }
}
