import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('REQUEST USER');
    console.log(user);

    if (user.role === 'admin') {
      return true;
    }

    throw new UnauthorizedException('Access do not authorized');
  }
}
