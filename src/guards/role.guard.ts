import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.params.id;
    const user = request.user;

    if(user.role === 'admin' || user.id === userId){
      return true
    } 

   throw new UnauthorizedException('Access do not authorized')
  }
}
