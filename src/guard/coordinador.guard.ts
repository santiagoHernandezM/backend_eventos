import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CoordinadorAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    const roles = user.roles;
    const rolesAuth = ['Coordinador', 'Administrator'];

    const hasRequiredRole = roles.some((rol) => rolesAuth.some(rol));
    if (!hasRequiredRole) {
      throw new UnauthorizedException(
        'Usuario no tiene los permisos necesarios',
      );
    }

    return user;
  }
}
