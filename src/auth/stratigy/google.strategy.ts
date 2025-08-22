import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from '../dto/create-auth.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user:CreateAuthDto = {
      name: name.givenName + ' ' + name.familyName,
      email: emails[0].value,
      google_picture: photos[0].value,
      provider: 'google',
      providerId: profile.id,
      emailVerified: true, // Google OAuth users are considered verified
      password: null, // Password is not used for Google OAuth
      phone: null, // Phone is not provided by Google OAuth
      address: null, // Address is not provided by Google OAuth
    };
    done(null, user);
  }
}
