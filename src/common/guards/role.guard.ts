import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !roles || roles.length === 0) {
      return false;
    }

    console.log('User roles:', user.roles);
    console.log('Required roles:', roles);

    const userRoles: string[] = Array.isArray(user.roles)
      ? user.roles
      : [user.roles]; // normalize to array

    const hasRole = userRoles.some((role) => roles.includes(role));
    return hasRole;
  }
}
