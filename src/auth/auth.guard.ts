import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from './constants';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic: boolean = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request: Request<Record<string, any>> = context
      .switchToHttp()
      .getRequest();
    const token = this.extractTokenFromHeader(request);
    console.log('token', token);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: Record<string, any> = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret,
        },
      );
      console.log('payload', payload);

      request['user'] = payload;
    } catch (error) {
      console.log('error', error);
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
