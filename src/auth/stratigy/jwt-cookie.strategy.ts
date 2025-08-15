import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PayLoad } from '../utils/auth';

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(Strategy, 'jwt-cookie') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtCookieStrategy.extractJWTFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(), // Fallback to header
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }
    return null;
  }

  async validate(payload: PayLoad) {
    return {
      id: payload.userId,
      email: payload.email,
      roles: payload.roles,
    };
  }
} 