import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    const roles = user.roles;

    const hasRequiredRole = roles.includes('Administrator');

    
    if (!hasRequiredRole) {
      throw new UnauthorizedException(
        'Usuario no tiene los permisos necesarios',
      );
    }

    return user;
  }
}
