import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library/build/src/auth/oauth2client';

@Injectable()
export class GoogleOAuth {
  private client;
  constructor() {
    this.client = new OAuth2Client(process.env.CLIENT_ID);
  }

  async verifyGoogleIdToken(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken: idToken,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  }
}
