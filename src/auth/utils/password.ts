import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class Password {
  // constructor(public bcrypt: bcrypt) {}

  async toHash(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  async compare(storedPassword: string, givenPassword: string) {
    const bool = await bcrypt.compare(givenPassword, storedPassword);
    return bool;
  }
}
